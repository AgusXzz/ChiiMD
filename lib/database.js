const defaultUser = {
	exp: 0,
	level: 1,
	limit: 20,
	age: -1,
	regTime: -1,
	afk: -1,
	afkReason: '',
	warn: 0,
	role: 'Newbie',
	premium: false,
	premiumTime: 0,
	registered: false,
	banned: false,
	autolevelup: false,
	// RPG
	money: 0,
	bank: 0,
	class: null,
	hp: 100,
	mana: 50,
	area: 'forest',
	kills: 0,
	deaths: 0,
	wins: 0,
	losses: 0,
	bossKills: 0,
	guild: null,
	lid: null,
	pet: null,
	title: null,
	statsBonus: {},
	buff: {},
	count: {},
	story: { chapter: 1, kills: 0, done: [] },
	ach: { claimed: [] },
	inventory: {},
	equipment: {},
	tools: {},
	farm: { slots: [] },
	quest: { daily: {}, weekly: {} },
	cd: {},
};

const defaultChat = {
	sWelcome: '',
	sBye: '',
	sPromote: '',
	sDemote: '',
	isBanned: false,
	welcome: false,
	detect: false,
	delete: false,
};

const defaultSettings = {
	public: true,
	autoread: true,
	anticall: true,
	gconly: true,
};

const defs = {
	users: defaultUser,
	chats: defaultChat,
	settings: defaultSettings,
};

// ponytail: cache in-memory penuh wajib dipertahankan karena API plugin membaca
// secara sinkron (db.data.users[uid].x). SQLite menyimpan per-baris; cache hanya
// bayangan yang di-flush tiap interval. Upscale bila perlu: lazy-load per id.
export function createStore(db) {
	const stores = {};
	for (const name of ['users', 'chats', 'settings', 'stats', 'sticker', 'guilds', 'market']) {
		stores[name] = collection(db, name, defs[name], name === 'users');
	}
	return stores;
}

function collection(db, name, defaults, lidLookup = false) {
	db.exec(`CREATE TABLE IF NOT EXISTS ${name} (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at INTEGER NOT NULL)`);
	const setStmt = db.prepare(`INSERT INTO ${name} (id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`);
	const delStmt = db.prepare(`DELETE FROM ${name} WHERE id = ?`);

	const target = Object.create(null);
	const dirty = new Set();
	const deleted = new Set();
	const mark = (id) => dirty.add(id);

	for (const row of db.prepare(`SELECT id, data FROM ${name}`).all()) {
		try {
			let value = JSON.parse(row.data);
			if (defaults) value = { ...defaults, ...value };
			target[row.id] = proxify(value, () => mark(row.id));
		} catch {
			/* row korup, skip */
		}
	}

	const proxy = new Proxy(target, {
		get: (t, id) => {
			if (typeof id !== 'string') return undefined;
			if (id in t) return t[id];
			// ponytail: lookup lid via scan linear — akses lid jarang; index terpisah kalau user ratusan ribu
			if (lidLookup && id.endsWith('@lid')) for (const v of Object.values(t)) if (v && v.lid === id) return v;
			return undefined;
		},
		set(t, id, value) {
			value = defaults && value && typeof value === 'object' ? { ...defaults, ...value } : value;
			t[id] = proxify(value, () => mark(id));
			dirty.add(id);
			deleted.delete(id);
			return true;
		},
		deleteProperty(t, id) {
			delete t[id];
			dirty.delete(id);
			deleted.add(id);
			return true;
		},
		has: (t, id) => id in t,
	});

	return {
		proxy,
		flush() {
			const now = Date.now();
			for (const id of dirty) {
				const value = target[id];
				value === undefined ? delStmt.run(id) : setStmt.run(id, JSON.stringify(value), now);
			}
			for (const id of deleted) delStmt.run(id);
			dirty.clear();
			deleted.clear();
		},
	};
}

// ponytail: proxify mendalam (objek + array). Plugin membaca entitas secara sinkron,
// jadi tiap mutasi bersarang (user.inventory.ore++, guild.members.push()) harus menandai
// row dirty. WeakMap per entitas mencegah proxy ganda; Date/Buffer dll dilewati.
function proxify(value, onWrite, seen = new WeakMap()) {
	if (!value || typeof value !== 'object') return value;
	if (value instanceof Date || value instanceof RegExp || value instanceof Map || value instanceof Set || Buffer.isBuffer(value)) return value;
	if (seen.has(value)) return seen.get(value);
	const p = new Proxy(value, {
		get(t, k, r) {
			const v = Reflect.get(t, k, r);
			return v !== null && typeof v === 'object' ? proxify(v, onWrite, seen) : v;
		},
		set(t, k, v, r) {
			Reflect.set(t, k, v !== null && typeof v === 'object' ? proxify(v, onWrite, seen) : v, r);
			onWrite();
			return true;
		},
		deleteProperty(t, k) {
			delete t[k];
			onWrite();
			return true;
		},
	});
	seen.set(value, p);
	return p;
}

export default function (m, conn) {
	try {
		if (m.sender.endsWith('@s.whatsapp.net')) {
			const lid = conn?.getLid?.(m.sender) || null;
			const u = global.db.data.users[m.sender];
			if (!u) {
				global.db.data.users[m.sender] = { ...defaultUser, name: m.name, lid };
			} else if (lid && lid !== m.sender && u.lid !== lid) {
				u.lid = lid;
			}
		}
		if (m.isGroup && !global.db.data.chats[m.chat]) {
			global.db.data.chats[m.chat] = { ...defaultChat };
		}
		if (!global.db.data.settings[conn.user.jid]) {
			global.db.data.settings[conn.user.jid] = { ...defaultSettings };
		}
	} catch (e) {
		console.error(e);
	}
}
