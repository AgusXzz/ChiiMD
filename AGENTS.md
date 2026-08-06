# AGENTS.md

WhatsApp multi-device bot (Baileys). Node ≥20 (Baileys requires it), ES modules (`"type": "module"`), no build step, no tests, no CI. Package manager: bun (`bun.lock`).

## Commands

- `npm start` — runs `node index.js`, which spawns `main.js` in a worker thread. On first run a pairing code prints to the terminal (number set in `config.js` → `global.pairingNumber`).
- `npm run lint` (eslint), `npm run format` (prettier `--write .`).
- No test/typecheck scripts exist. Verify with `node --check <file>` + lint.

## Runtime architecture

- `index.js` — supervisor. Manages the worker, handles stdin (`exit` / `restart` / `reset`), restarts on `main.js` edits (file watch, ~5 s poll) and on crash (30 min delay).
- `main.js` — the bot worker: Baileys socket, globals, DB init, plugin loader, `fs.watch` hot-reload of `plugins/`. Do not confuse its `global.__dirname()` (applies `dirname` to a path) with `path.dirname`.
- `handler.js` — per-message dispatch loop over `global.plugins`; runs `plugin.all` (if defined) on every message, then matches `plugin.command` against prefixed text.
- `lib/simple.js` — Baileys socket wrapper: `smsg()` serializes incoming messages, plus helpers (`sendFile`, `sendButton`, `adReply`, `copyNForward`, `downloadM`, `parseMention`, …). `lib/database.js` builds the per-user DB shape + SQLite store; `lib/useSQLite.js` is the Baileys auth-state store.

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
- **Guard flags** set on the handler: `handler.owner`/`rowner`, `handler.premium`, `handler.group`, `handler.private`, `handler.admin`, `handler.botAdmin`, `handler.register` (must `.daftar` first), `handler.limit` (consumes limit, premium exempt), `handler.level`. `handler.before` runs before the command (return truthy to skip), `handler.after` after; `plugin.all` runs on every message.
- Files starting with `_` are non-command logic: registration/XP/premium guards (`_role.js`, `_premium.js`), anti-spam (`_antispam.js`), AFK (`_afk.js`), media re-emit (`_cmdWithMedia.js`), button re-emit (`_templateResponse.js`). Look at those before wiring a command to a guard.
- Plugin files hot-reload on save; `main.js` / `handler.js` / `config.js` edits trigger a worker restart. Do not hand-edit `index.js`'s watch/restart behavior.

## State & storage

- WhatsApp auth lives in `sessions/` (SQLite-backed, via `lib/useSQLite.js`). Deleting it logs the bot out (used as a reset fix).
- Bot data lives in `data/database.db` as one SQLite table per collection (`users`, `chats`, `settings`, `stats`, `sticker`, `guilds`, `market`), one row per entity. `lib/database.js` (`createStore`) exposes `global.db.data.*` as Proxy-backed maps over an in-memory cache; writes mark rows dirty and `main.js` flushes them by `setInterval` (`main.js:130`). The proxy does **deep tracking** (objects + arrays), so `user.inventory.ore++` / `guild.members.push()` persist. A legacy JSON blob in a `database` table is auto-migrated to rows on boot then dropped. Adding a user field = adding a key to `defaultUser`; cached rows get it merged on load.
- The 5 s flush interval also runs `expireMarket()` (refund 24 h-expired market listings). Auto-backup of `data/` + `sessions/` runs every 6 h via `lib/backup.js` into `backup/` (keeps 5); manual `.backup` (owner).
- Both `sessions/` and `data/` are gitignored; runtime-generated files (`backup/`, `tmp/`, `.opencode/`) should never be committed.

## RPG engine

- `lib/rpg.js` is the single source of truth for the game: `ITEMS` (with `rarity`/`source`/`trait`/`buff`), `CLASSES`, `AREAS`/bosses, `RECIPES`, `CHAPTERS` (story campaign), `ACHIEVEMENTS`, `NPC_LIST`, `getStats()` (class + equipment + trait + pet + `statsBonus` + active `buff`), and helpers (`addItem`, `storyKill`, `grantAchievements`, `eventState`, `sendBtn`/`BTN`).
- The `rpg-*.js` plugins are thin command layers; game data/balance lives in `lib/rpg.js`. Item emojis come from `global.emoji` in `config.js` (single source).
- **Buttons**: `sendBtn(conn, m, text, buttons)` builds a native-flow interactive message; every button `id` must be a **prefixed command** (e.g. `.attack`) because `_templateResponse.js` re-emits presses as normal messages.
- Handlers that use `this` (the socket) must be **regular functions**, not arrow functions (`let handler = async function (m, ...)`) — arrows lose the `this` binding and crash with "Cannot read properties of undefined".
- Buffs (`user.buff`) are turn-based: each battle action calls `consumeTurns(user, 1)`; they expire after N turns.

## Conventions / gotchas

- Config is `global.*` assignment in `config.js` (owner numbers, bot name, `global.emoji`). Prefix characters are hardcoded in `main.js` (`global.prefix`), not in `config.js`.
- Prettier: tabs, single quotes, `printWidth: 200`. Existing code is permissive (some files not yet formatted); keep new code matching the config.
- ESLint runs with `no-undef` off because the codebase relies on heavy `global.*` usage.
- Code/comments are a mix of Indonesian and English; messages to users are Indonesian. Match whichever a file already uses.
- `main.js` was deobfuscated from the original obfuscated source; old git commits may still show obfuscated code — judge from the working tree, not history.
