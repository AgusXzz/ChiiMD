const TTL = 30 * 60 * 1000;
const store = new Map();

export function get(kind, key) {
	const entry = store.get(kind + ':' + key);
	if (!entry) return undefined;
	if (Date.now() - entry.ts > TTL) {
		store.delete(kind + ':' + key);
		return undefined;
	}
	entry.ts = Date.now();
	return entry.val;
}

export function set(kind, key, val) {
	store.set(kind + ':' + key, { ts: Date.now(), val });
}

export function del(kind, key) {
	store.delete(kind + ':' + key);
}

export function has(kind, key) {
	return get(kind, key) !== undefined;
}

export function sweep() {
	const now = Date.now();
	for (const [k, entry] of store) {
		if (now - entry.ts > TTL) store.delete(k);
	}
}
