//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import './config.js';

import { createRequire } from 'module'; // Bring in the ability to create the 'require' method
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = process.platform !== 'win32') {
	return rmPrefix ? (/file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL) : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
	return path.dirname(global.__filename(pathURL, true));
};
global.__require = function require(dir = import.meta.url) {
	return createRequire(dir);
};

import fs from 'fs';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { format } from 'util';
import { parentPort } from 'worker_threads';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import chalk from 'chalk';
import pino from 'pino';
import syntaxerror from 'syntax-error';
import Database from 'better-sqlite3';

import useSQLiteAuthState from './lib/useSQLite.js';

import { Browsers, fetchLatestWaWebVersion, makeCacheableSignalKeyStore } from 'baileys';

protoType();
serialize();

const __dirname = global.__dirname(import.meta.url);

global.prefix = new RegExp('^[' + '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-'.replace(/[|\\{}[\]()^$+*?.-]/g, '\\$&') + ']');
global.db = {
	sqlite: null,
	data: null,
};

global.loadDatabase = function () {
	if (!global.db.sqlite) {
		const dbFile = path.resolve('./data/database.db');
		fs.mkdirSync(path.dirname(dbFile), { recursive: true });

		global.db.sqlite = new Database(dbFile);
		global.db.sqlite.pragma('journal_mode = WAL');
		global.db.sqlite.pragma('synchronous = NORMAL');
		global.db.sqlite.pragma('wal_autocheckpoint = 1000');

		global.db.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS database (
        id INTEGER PRIMARY KEY,
        data TEXT
      )
    `);
	}

	if (global.db.data !== null) return;

	global.db.data = {
		users: {},
		chats: {},
		stats: {},
		msgs: {},
		sticker: {},
		settings: {},
	};

	const row = global.db.sqlite.prepare('SELECT data FROM database WHERE id = 1').get();

	if (row?.data) {
		try {
			Object.assign(global.db.data, JSON.parse(row.data));
		} catch {
			console.error('[DB] JSON rusak, reset database');
		}
	} else {
		global.db.sqlite.prepare('INSERT OR IGNORE INTO database (id, data) VALUES (1, ?)').run(JSON.stringify(global.db.data));
	}
};
loadDatabase();

const { state, saveCreds } = await useSQLiteAuthState('sessions');
const { version } = await fetchLatestWaWebVersion();
const connectionOptions = {
	auth: {
		creds: state.creds,
		keys: makeCacheableSignalKeyStore(state.keys, pino().child({ level: 'fatal', stream: 'store' })),
	},
	version,
	logger: pino({ level: 'silent' }),
	browser: Browsers.ubuntu('Edge'),
	generateHighQualityLinkPreview: true,
	syncFullHistory: false,
	shouldSyncHistoryMessage: () => false,
	markOnlineOnConnect: true,
	connectTimeoutMs: 60_000,
	keepAliveIntervalMs: 30_000,
	retryRequestDelayMs: 250,
	maxMsgRetryCount: 5,
};

global.conn = makeWASocket(connectionOptions);

if (fs.existsSync('./sessions/auth.db') && !conn.authState.creds.registered) {
	console.log(chalk.yellow('-- WARNING: creds.json is broken, please delete it first --'));
	//fs.rmSync('./sessions', { recursive: true, force: true })
	process.exit(0);
}

if (!conn.authState.creds.registered) {
	console.log(chalk.bgWhite(chalk.blue('Generating code...')));
	try {
		setTimeout(async () => {
			let code = await conn.requestPairingCode(global.pairingNumber);
			code = code?.match(/.{1,4}/g)?.join('-') || code;
			console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)));
		}, 3000);
	} catch (e) {
		console.log(e);
		fs.rmSync('./sessions', { recursive: true, force: true });
		parentPort.postMessage('restart');
	}
}

if (global.db) {
	setInterval(() => {
		if (global.db.data) {
			global.db.sqlite.prepare('UPDATE database SET data = ? WHERE id = 1').run(JSON.stringify(global.db.data));
		}

		if ((global.support || {}).find) {
			const tmp = [tmpdir(), 'tmp'];
			tmp.forEach((filename) => spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete']));
		}
	}, 5000);
}

async function connectionUpdate(update) {
	const { receivedPendingNotifications, connection, lastDisconnect, isOnline } = update;

	if (connection == 'connecting') {
		console.log(chalk.redBright('⚡ Mengaktifkan Bot, Mohon tunggu sebentar...'));
	} else if (connection == 'open') {
		console.log(chalk.green('✅ Tersambung'));
	}

	if (isOnline == true) {
		console.log(chalk.green('Status Aktif'));
	} else if (isOnline == false) {
		console.log(chalk.red('Status Mati'));
	}

	if (receivedPendingNotifications) {
		console.log(chalk.yellow('Menunggu Pesan Baru'));
	}

	if (connection == 'close') {
		console.log(chalk.red('⏱️ Koneksi terputus & mencoba menyambung ulang...'));
	}

	if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.payload) {
		console.log(chalk.red(lastDisconnect.error.output.payload.message));
		await global.reloadHandler(true);
	}

	if (global.db.data == null) {
		await global.loadDatabase();
	}
}

process.on('uncaughtException', console.error);
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

let isInit = true;
let handler = await import('./handler.js');
global.reloadHandler = async function (restatConn) {
	try {
		const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
		if (Object.keys(Handler || {}).length) handler = Handler;
	} catch (e) {
		console.error(e);
	}
	if (restatConn) {
		const oldChats = global.conn.chats;
		try {
			global.conn.ws.close();
		} catch {}
		conn.ev.removeAllListeners();
		global.conn = makeWASocket(connectionOptions, { chats: oldChats });
		isInit = true;
	}
	if (!isInit) {
		conn.ev.off('messages.upsert', conn.handler);
		conn.ev.off('group-participants.update', conn.participantsUpdate);
		conn.ev.off('groups.update', conn.groupsUpdate);
		conn.ev.off('message.delete', conn.onDelete);
		conn.ev.off('connection.update', conn.connectionUpdate);
		conn.ev.off('creds.update', conn.credsUpdate);
	}

	conn.welcome =
		'✦━━━━━━[ *WELCOME* ]━━━━━━✦\n\n┏––––––━━━━━━━━•\n│⫹⫺ @subject\n┣━━━━━━━━┅┅┅\n│( 👋 Hallo @user)\n├[ *INTRO* ]—\n│ *Nama:* \n│ *Umur:* \n│ *Gender:*\n┗––––––━━┅┅┅\n\n––––––┅┅ *DESCRIPTION* ┅┅––––––\n@desc';
	conn.bye = '✦━━━━━━[ *GOOD BYE* ]━━━━━━✦\nSayonara *@user* 👋( ╹▽╹ )';
	conn.spromote = '@user sekarang admin!';
	conn.sdemote = '@user sekarang bukan admin!';
	conn.sDesc = 'Deskripsi telah diubah ke \n@desc';
	conn.sSubject = 'Judul grup telah diubah ke \n@subject';
	conn.sIcon = 'Icon grup telah diubah!';
	conn.sRevoke = 'Link group telah diubah ke \n@revoke';
	conn.handler = handler.handler.bind(global.conn);
	conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
	conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
	conn.onDelete = handler.deleteUpdate.bind(global.conn);
	conn.connectionUpdate = connectionUpdate.bind(global.conn);
	conn.credsUpdate = saveCreds.bind(global.conn);

	conn.ev.on('call', async (calls) => {
		for (const call of calls) {
			const { id, from, status } = call;
			const settings = global.db.data.settings[conn.user.jid];
			if (status === 'offer' && settings.anticall) {
				await conn.rejectCall(id, from);
				console.log('Menolak panggilan dari', from);
			}
		}
	});

	conn.ev.on('messages.upsert', conn.handler);
	conn.ev.on('group-participants.update', conn.participantsUpdate);
	conn.ev.on('groups.update', conn.groupsUpdate);
	conn.ev.on('message.delete', conn.onDelete);
	conn.ev.on('connection.update', conn.connectionUpdate);
	conn.ev.on('creds.update', conn.credsUpdate);
	isInit = false;
	return true;
};

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};
async function filesInit() {
	for (let filename of fs.readdirSync(pluginFolder).filter(pluginFilter)) {
		try {
			let file = global.__filename(join(pluginFolder, filename));
			const module = await import(file);
			global.plugins[filename] = module.default || module;
		} catch (e) {
			conn.logger.error(`❌ Failed to load plugins ${filename}: ${e}`);
			delete global.plugins[filename];
		}
	}
}
filesInit()
	.then((_) => console.log(`Successfully Loaded ${Object.keys(global.plugins).length} Plugins`))
	.catch(console.error);

global.reload = async (_ev, filename) => {
	if (pluginFilter(filename)) {
		let dir = global.__filename(join(pluginFolder, filename), true);
		if (filename in global.plugins) {
			if (fs.existsSync(dir)) conn.logger.info(`re - require plugin '${filename}'`);
			else {
				conn.logger.warn(`deleted plugin '${filename}'`);
				return delete global.plugins[filename];
			}
		} else conn.logger.info(`requiring new plugin '${filename}'`);
		let err = syntaxerror(fs.readFileSync(dir), filename, {
			sourceType: 'module',
			allowAwaitOutsideFunction: true,
		});
		if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`);
		else
			try {
				const module = await import(`${global.__filename(dir)}?update=${Date.now()}`);
				global.plugins[filename] = module.default || module;
			} catch (e) {
				conn.logger.error(`error require plugin '${filename}\n${format(e)}'`);
			} finally {
				global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
			}
	}
};
Object.freeze(global.reload);
fs.watch(pluginFolder, global.reload);
await global.reloadHandler();

// Quick Test
async function _quickTest() {
	let test = await Promise.all(
		[
			spawn('ffmpeg'),
			spawn('ffprobe'),
			spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
			spawn('convert'),
			spawn('magick'),
			spawn('gm'),
			spawn('find', ['--version']),
		].map((p) => {
			return Promise.race([
				new Promise((resolve) => {
					p.on('close', (code) => {
						resolve(code !== 127);
					});
				}),
				new Promise((resolve) => {
					p.on('error', (_) => resolve(false));
				}),
			]);
		})
	);
	let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
	//console.log(test)
	let s = (global.support = {
		ffmpeg,
		ffprobe,
		ffmpegWebp,
		convert,
		magick,
		gm,
		find,
	});
	// require('./lib/sticker').support = s
	Object.freeze(global.support);

	if (!s.ffmpeg) conn.logger.warn('Please install ffmpeg for sending videos (apt install ffmpeg)');
	if (s.ffmpeg && !s.ffmpegWebp) conn.logger.warn('Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)');
	if (!s.convert && !s.magick && !s.gm) conn.logger.warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (apt install imagemagick)');
}

_quickTest()
	.then(() => conn.logger.info('☑️ Quick Test Done'))
	.catch(console.error);
