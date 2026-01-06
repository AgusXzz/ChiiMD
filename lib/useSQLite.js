//Croted By ChatGpt
import Database from 'better-sqlite3';
import { Mutex } from 'async-mutex';
import { BufferJSON, initAuthCreds, proto } from 'baileys';
import path from 'path';
import fs from 'fs';

export default async (folder = './sessions') => {
	const mutex = new Mutex();
	const ALLOWED_KEYS = new Set(['pre-key', 'session', 'sender-key', 'app-state-sync-key', 'app-state-sync-version']);

	const dir = path.resolve(`${folder}/auth.db`);
	fs.mkdirSync(path.dirname(dir), { recursive: true });
	const db = new Database(dir);

	db.pragma('journal_mode = WAL');
	db.pragma('synchronous = NORMAL');
	db.pragma('temp_store = MEMORY');
	db.pragma('foreign_keys = ON');

	db.exec(`
		CREATE TABLE IF NOT EXISTS creds (
			id INTEGER PRIMARY KEY CHECK (id = 1),
			data TEXT NOT NULL,
			updated_at INTEGER
		);

		CREATE TABLE IF NOT EXISTS keys (
			category TEXT NOT NULL,
			id TEXT NOT NULL,
			data TEXT,
			updated_at INTEGER,
			PRIMARY KEY (category, id)
		);
	`);

	const stmtGetCreds = db.prepare(`SELECT data FROM creds WHERE id=1`);
	const stmtSetCreds = db.prepare(
		`INSERT OR REPLACE INTO creds
		 (id, data, updated_at)
		 VALUES (1, ?, ?)`
	);

	const stmtGetKey = db.prepare(
		`SELECT data FROM keys
		 WHERE category=? AND id=?`
	);
	const stmtSetKey = db.prepare(
		`INSERT OR REPLACE INTO keys
		 (category, id, data, updated_at)
		 VALUES (?, ?, ?, ?)`
	);
	const stmtDelKey = db.prepare(
		`DELETE FROM keys
		 WHERE category=? AND id=?`
	);

	const readCreds = async () =>
		mutex.runExclusive(() => {
			const row = stmtGetCreds.get();
			return row ? JSON.parse(row.data, BufferJSON.reviver) : null;
		});

	const writeCreds = async (creds) =>
		mutex.runExclusive(() => {
			stmtSetCreds.run(JSON.stringify(creds, BufferJSON.replacer), Date.now());
		});

	const readKey = async (category, id) =>
		mutex.runExclusive(() => {
			const row = stmtGetKey.get(category, id);
			if (!row) return null;

			let value = JSON.parse(row.data, BufferJSON.reviver);

			if (category === 'app-state-sync-key') {
				value = proto.Message.AppStateSyncKeyData.fromObject(value);
			}

			return value;
		});

	const writeKey = async (category, id, value) =>
		mutex.runExclusive(() => {
			stmtSetKey.run(category, id, JSON.stringify(value, BufferJSON.replacer), Date.now());
		});

	const removeKey = async (category, id) =>
		mutex.runExclusive(() => {
			stmtDelKey.run(category, id);
		});

	const creds = (await readCreds()) || initAuthCreds();

	return {
		state: {
			creds,
			keys: {
				get: async (type, ids) => {
					const result = {};
					for (const id of ids) {
						result[id] = await readKey(type, id);
					}
					return result;
				},

				set: async (data) => {
					const tasks = [];
					for (const category in data) {
						if (!ALLOWED_KEYS.has(category)) continue;

						for (const id in data[category]) {
							const value = data[category][id];
							tasks.push(value ? writeKey(category, id, value) : removeKey(category, id));
						}
					}
					await Promise.all(tasks);
				},
			},
		},

		saveCreds: async () => {
			await writeCreds(creds);
		},
	};
};
