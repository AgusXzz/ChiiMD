let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!m.quoted) throw `Balas stiker dengan perintah *${usedPrefix + command}*`
	if (!m.quoted.fileSha256) throw 'SHA256 Hash Missing'
	if (!text) throw `Penggunaan:\n${usedPrefix + command} <teks>\n\nContoh:\n${usedPrefix + command} tes`
	let sticker = db.data.sticker
	let hash = m.quoted.fileSha256
	if (sticker[hash] && sticker[hash].locked) throw 'Kamu tidak memiliki izin untuk mengubah perintah stiker ini'
	sticker[hash] = {
		text,
		mentionedJid: m.mentionedJid,
		creator: m.sender,
		at: Date.now(),
		locked: false,
	}
	m.reply(`Success!`)
}

handler.help = ['setcmd <teks>']
handler.tags = ['database']
handler.command = ['setcmd']

export default handler
