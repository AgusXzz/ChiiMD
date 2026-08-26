import { parentPort } from 'worker_threads';

const handler = async (m, { conn }) => {
	if (!parentPort) throw 'Dont: node main.js\nDo: node index.js';
	if (global.conn.user.jid == conn.user.jid) {
		await m.reply('```R E S T A R T . . .```');
		parentPort.postMessage('restart');
	} else throw '_eeeeeiiittsssss..._';
};

handler.help = ['restart'];
handler.tags = ['owner'];
handler.command = /^(res(tart)?)$/i;
handler.owner = true;

export default handler;
