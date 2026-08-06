# AGENTS.md

WhatsApp multi-device bot (Baileys). Node ≥18, ES modules (`"type": "module"`), no build step, no tests, no CI.

## Commands

- `npm start` — runs `node index.js`, which spawns `main.js` in a worker thread. On first run a pairing code prints to the terminal (number set in `config.js` → `global.pairingNumber`).
- `npm run lint` (eslint), `npm run format` (prettier `--write .`).
- No test/typecheck scripts exist. Verify with `node --check <file>` + lint.

## Runtime architecture

- `index.js` — supervisor. Manages the worker, handles stdin (`exit` / `restart` / `reset`), restarts on `main.js` edits (file watch, ~5 s poll) and on crash (30 min delay).
- `main.js` — the bot worker: Baileys socket, globals, DB init, plugin loader, `fs.watch` hot-reload of `plugins/`. Do not confuse its `global.__dirname()` (applies `dirname` to a path) with `path.dirname`.
- `handler.js` — per-message dispatch loop over `global.plugins`; runs `plugin.all` (if defined) on every message, then matches `plugin.command` against prefixed text.
- `lib/simple.js` — `smsg()` serializes incoming messages; `lib/database.js` builds the per-user DB shape; `lib/useSQLite.js` is the Baileys auth-state store.

## Adding a command

Create `plugins/<something>.js` exporting a default async handler:

```js
let handler = async (m) => {
	m.reply('hi');
};
handler.help = ['hello'];
handler.tags = ['info'];
handler.command = ['hello', 'hi'];
export default handler;
```

- `.command` entries are lowercase, no prefix. Any prefix char in the regex defined in `main.js` (`.` `#` `!` `/` etc.) works — the prefix list is NOT in `config.js`.
- Inside the handler, `this` is the Baileys socket, `m` is the serialized message with helpers (`m.reply`, `m.react`, `m.sender`, `m.isGroup`). Ownership checks use `m.sender` against `global.owner` in `config.js`.
- Files starting with `_` are non-command logic: registration/XP/premium guards (`_role.js`, `_premium.js`), media pre-processing (`_cmdWithMedia.js`), template helpers (`_templateResponse.js`). Look at those before wiring a command to a guard.
- Plugin files hot-reload on save; `main.js` / `handler.js` / `config.js` edits trigger a worker restart. Do not hand-edit `index.js`'s watch/restart behavior.

## State & storage

- WhatsApp auth lives in `sessions/` (SQLite-backed, via `lib/useSQLite.js`). Deleting it logs the bot out (used as a reset fix).
- Bot data lives in `data/database.db` as one SQLite table per collection (`users`, `chats`, `settings`, `stats`, `sticker`), one row per entity. `lib/database.js` (`createStore`) exposes `global.db.data.*` as Proxy-backed maps over an in-memory cache; writes mark rows dirty and `main.js` flushes them by `setInterval` (`main.js:126`). A legacy JSON blob in a `database` table is auto-migrated to rows on boot then dropped. Adding a user field = adding a key to `defaultUser`; cached rows get it merged on load.
- Both `sessions/` and `data/` are gitignored; runtime-generated files should never be committed.

## Conventions / gotchas

- Config is `global.*` assignment in `config.js` (owner numbers, bot name). The README shows a `module.exports` config that does NOT match this codebase — trust `config.js`/`main.js`.
- Prettier: tabs, single quotes, `printWidth: 200`. Existing code is permissive (some files not yet formatted); keep new code matching the config.
- ESLint runs with `no-undef` off because the codebase relies on heavy `global.*` usage.
- Code/comments are a mix of Indonesian and English; messages to users are Indonesian. Match whichever a file already uses.
- `main.js` was recently deobfuscated (committed versions are obfuscated); work off the working tree, not `git show HEAD:main.js`.
