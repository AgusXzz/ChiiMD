//Croted by Claude
import Database from 'better-sqlite3';
import { Mutex } from 'async-mutex';
import { BufferJSON, initAuthCreds, proto } from 'baileys';
import path from 'path';
import fs from 'fs';

export default async (folder = './sessions') => {
	const dir = path.resolve(folder);
	fs.mkdirSync(dir, { recursive: true });

	const dbs = new Map();
	const stmts = new Map();
	const mutexes = new Map();
	const cache = new Map();
	const dirty = new Map();

	const getCache = (cat) => {
		if (!cache.has(cat)) cache.set(cat, new Map());
		return cache.get(cat);
	};
	const getDirty = (cat) => {
		if (!dirty.has(cat)) dirty.set(cat, new Set());
		return dirty.get(cat);
	};
	const getMutex = (cat) => {
		if (!mutexes.has(cat)) mutexes.set(cat, new Mutex());
		return mutexes.get(cat);
	};
	const totalDirty = () => [...dirty.values()].reduce((n, s) => n + s.size, 0);

	const getDB = (category) => {
		if (dbs.has(category)) return dbs.get(category);

		const db = new Database(path.join(dir, `${category.replace(/[^\w-]/g, '_')}.db`));
		db.pragma('journal_mode = WAL');
		db.pragma('synchronous = NORMAL');
		db.pragma('temp_store = MEMORY');
		db.pragma('foreign_keys = ON');
		db.pragma('cache_size = -8000');
		db.pragma('mmap_size = 67108864');

		if (category === 'creds') {
			db.exec(`CREATE TABLE IF NOT EXISTS creds (
				id INTEGER PRIMARY KEY CHECK (id = 1),
				data TEXT NOT NULL,
				updated_at INTEGER
			);`);
			stmts.set(category, {
				get: db.prepare(`SELECT data FROM creds WHERE id = 1`),
				set: db.prepare(`INSERT OR REPLACE INTO creds (id, data, updated_at) VALUES (1, ?, ?)`),
			});
		} else {
			db.exec(`CREATE TABLE IF NOT EXISTS data (
				id TEXT PRIMARY KEY,
				data TEXT,
				updated_at INTEGER
			);`);
			stmts.set(category, {
				get: db.prepare(`SELECT id, data FROM data WHERE id = ?`),
				set: db.prepare(`INSERT OR REPLACE INTO data (id, data, updated_at) VALUES (?, ?, ?)`),
				del: db.prepare(`DELETE FROM data WHERE id = ?`),
				getAll: db.prepare(`SELECT id, data FROM data`),
			});
		}

		dbs.set(category, db);
		return db;
	};

	const warmCache = (category) => {
		if (cache.has(category)) return;
		getDB(category);
		const mem = getCache(category);
		for (const row of stmts.get(category).getAll.all()) {
			let value = JSON.parse(row.data, BufferJSON.reviver);
			if (category === 'app-state-sync-key') value = proto.Message.AppStateSyncKeyData.fromObject(value);
			mem.set(row.id, value);
		}
	};

	const flushCategory = (category) => {
		const ids = getDirty(category);
		if (!ids.size) return;
		getDB(category);
		const mem = getCache(category);
		const { set, del } = stmts.get(category);
		const now = Date.now();
		dbs.get(category).transaction(() => {
			for (const id of ids) {
				const value = mem.get(id);
				value !== undefined ? set.run(id, JSON.stringify(value, BufferJSON.replacer), now) : del.run(id);
			}
		})();
		ids.clear();
	};

	const flushAll = () => {
		for (const category of dirty.keys()) {
			try {
				flushCategory(category);
			} catch (err) {
				console.error(`[auth] flush error [${category}]:`, err);
			}
		}
	};

	const close = () => {
		clearInterval(flushTimer);
		flushAll();
		for (const db of dbs.values()) db.close();
	};

	// ── Auto flush ───────────────────────────────────────────────────
	const flushTimer = setInterval(flushAll, 500);
	flushTimer.unref();

	process.once('exit', flushAll);

	process.once('SIGTERM', () => {
		close();
		process.exit(0);
	});

	const onUncaught = (err) => {
		console.error('[auth] uncaught, flushing before exit:', err);
		flushAll();
	};
	process.once('uncaughtException', onUncaught);
	process.once('unhandledRejection', onUncaught);

	// ── Load creds ─────────────────────────────────────────────────────────────
	getDB('creds');
	const credsRow = stmts.get('creds').get.get();
	const creds = credsRow ? JSON.parse(credsRow.data, BufferJSON.reviver) : initAuthCreds();

	return {
		state: {
			creds,
			keys: {
				get: (type, ids) => {
					if (!ids?.length) return {};
					try {
						warmCache(type);
						const mem = getCache(type);
						return Object.fromEntries(ids.map((id) => [id, mem.get(id) ?? null]));
					} catch (err) {
						console.error(`[auth] keys.get [${type}]:`, err);
						return Object.fromEntries(ids.map((id) => [id, null]));
					}
				},
				set: (data) => {
					for (const [category, items] of Object.entries(data)) {
						if (!items) continue;
						const mem = getCache(category);
						const dirtySet = getDirty(category);
						for (const [id, value] of Object.entries(items)) {
							value != null ? mem.set(id, value) : mem.delete(id);
							dirtySet.add(id);
						}
					}
					if (totalDirty() >= 50) flushAll();
				},
			},
		},
		saveCreds: async () => {
			await getMutex('creds').runExclusive(() => {
				stmts.get('creds').set.run(JSON.stringify(creds, BufferJSON.replacer), Date.now());
			});
		},
		close,
	};
};
