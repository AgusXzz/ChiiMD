let handler = async (m) => {
	if (!m.quoted) return m.reply('Reply gambar/video yang ingin Anda lihat')
	if (m.quoted.mediaMessage[m.quoted?.mediaType]?.viewOnce) {
		let msg = await m.getQuotedObj()?.message
		let type = Object.keys(msg)[0]
		let media = (await m.quoted?.download()) || (await m.getQuotedObj().download())
		if (!media) return m.reply('Media gagal di Eksekusi!')

		await conn.sendFile(m.chat, media, 'error.mp4', msg[type]?.caption || '', m)
	} else m.reply('Ini bukan pesan view-once.')
}

handler.help = ['rvo']
handler.tags = ['tools']
handler.command = /^rvo|read/i
handler.register = true

export default handler
