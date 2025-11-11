let handler = async (m, { text, usedPrefix, command }) => {
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || ''

	if (/image|video|webp/.test(mime)) {
		if ((q.msg?.seconds || q.seconds) > 10) {
			return m.reply('Video harus berdurasi di bawah 10 detik.')
		}

		let media = await q.download()
		let exif
		if (text) {
			const [packname, author] = text.split(/[,|\-+&]/)
			exif = { packName: packname || '', packPublish: author || '' }
		}
		conn.sendSticker(m.chat, media, m, exif)
	} else {
		m.reply('Kirim atau reply media untuk dijadikan stiker.')
	}
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = /^s(tic?ker)?(gif)?$/i
handler.register = true

export default handler
