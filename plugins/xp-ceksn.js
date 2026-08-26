import { createHash } from 'crypto';

const handler = async function (m) {
	const sn = createHash('md5').update(m.sender).digest('hex');
	m.reply(`*SN:* ${sn}`);
};

handler.help = ['ceksn'];
handler.tags = ['xp'];
handler.command = /^(ceksn)$/i;
handler.register = true;
export default handler;
