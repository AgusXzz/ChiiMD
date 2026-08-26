import { createHash } from 'crypto';
const handler = async function (m, { args }) {
	if (!args[0]) throw 'Serial Number kosong';
	const user = global.db.data.users[m.sender];
	const sn = createHash('md5').update(m.sender).digest('hex');
	if (args[0] !== sn) throw 'Serial Number salah';
	user.registered = false;
	m.reply('```Success Unreg !```');
};
handler.help = ['unregister <SN|SERIAL NUMBER>'];
handler.tags = ['xp'];
handler.command = /^unreg(ister)?$/i;
handler.register = true;

export default handler;
