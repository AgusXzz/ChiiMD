import cp, { exec as _exec } from 'child_process';
import { promisify } from 'util';
const exec = promisify(_exec).bind(cp);
const handler = async (m, { conn, command, text }) => {
	if (global.conn.user.jid != conn.user.jid) return;
	const { key } = await m.reply('Executing...');
	let o;
	try {
		o = await exec(command.trimStart() + ' ' + text.trimEnd());
	} catch (e) {
		o = e;
	} finally {
		const { stdout, stderr } = o;
		if (stdout.trim()) m.edit(stdout, key);
		if (stderr.trim()) m.reply(stderr);
	}
};
handler.help = ['$'];
handler.tags = ['owner'];
handler.customPrefix = /^[$] /;
handler.command = new RegExp();
handler.owner = true;
export default handler;
