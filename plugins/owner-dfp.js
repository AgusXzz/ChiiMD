import path from 'path';
import { unlinkSync } from 'fs';
let handler = async (m, { usedPrefix, __dirname, args }) => {
	let ar = Object.keys(plugins);
	let ar1 = ar.map((v) => v.replace('.js', ''));
	if (!args) throw `uhm.. where the text?\n\nexample:\n${usedPrefix + command} info`;
	if (!ar1.includes(args[0])) throw `*🗃️ NOT FOUND!*\n==================================\n\n${ar1.map((v) => ' ' + v).join`\n`}`;
	const file = path.join(__dirname, '../plugins/' + args[0] + '.js');
	unlinkSync(file);
	conn.reply(m.chat, `Succes deleted "plugins/${args[0]}.js"`, m);
};
handler.help = ['dfp'];
handler.tags = ['owner'];
handler.command = /^(dfp)$/i;
handler.owner = true;

export default handler;
