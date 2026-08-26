import fs from 'fs';
import syntaxError from 'syntax-error';

const handler = async (m, { text, usedPrefix, command }) => {
	if (!text) throw `uhm.. teksnya mana?\n\npenggunaan:\n${usedPrefix + command} <teks>\n\ncontoh:\n${usedPrefix + command} plugins/file.js`;

	if (!m.quoted?.text) throw `balas pesan nya!`;

	const code = m.quoted.text;
	const path = `./plugins/${text}.js`;

	const err = syntaxError(code, path, {
		sourceType: 'module',
		allowAwaitOutsideFunction: true,
	});

	if (err)
		throw `❌ Syntax Error

Message : ${err.message}
Line : ${err.line}
Column : ${err.column}
Annotated : ${err.annotated}`;
	fs.writeFileSync(path, code);
	m.reply(`✅ tersimpan di ${path}`);
};

handler.help = ['sfp <text>'];
handler.tags = ['owner'];
handler.command = /^sfp$/i;
handler.owner = true;

export default handler;
