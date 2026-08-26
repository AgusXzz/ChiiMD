import syntaxerror from 'syntax-error';
import * as baileys from 'baileys';
import { format } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);

const handler = async (m, _2) => {
	const { conn, usedPrefix, noPrefix, groupMetadata } = _2;
	let _return;
	let _syntax = '';
	const _text = (/^=/.test(usedPrefix) ? 'return ' : '') + noPrefix;
	const old = m.exp * 1;
	try {
		let i = 15;
		const f = {
			exports: {},
		};
		const exec = new (async () => {}).constructor('print', 'm', 'require', 'conn', 'baileys', 'groupMetadata', 'module', 'exports', 'argument', _text);
		_return = await exec.call(
			conn,
			(...args) => {
				if (--i < 1) return;
				console.log(...args);
				return conn.reply(m.chat, format(...args), m);
			},
			m,
			require,
			conn,
			baileys,
			groupMetadata,
			f,
			f.exports,
			[conn, _2]
		);
	} catch (e) {
		const err = syntaxerror(_text, 'Execution Function', {
			allowReturnOutsideFunction: true,
			allowAwaitOutsideFunction: true,
			sourceType: 'module',
		});
		if (err) _syntax = '```' + err + '```\n\n';
		_return = e;
	} finally {
		conn.reply(m.chat, _syntax + format(_return), m);
		m.exp = old;
	}
};
handler.help = ['>', '=>'];
handler.tags = ['owner'];
handler.customPrefix = /^=?> /;
handler.command = /(?:)/i;
handler.owner = true;

export default handler;
