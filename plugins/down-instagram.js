import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
	try {
		const input = m.quoted ? m.quoted.text : text
		const regex = /(https?:\/\/(?:www\.)?instagram\.com\/(p|reel)\/[a-zA-Z0-9_-]+\/?)/
		const parseUrl = input.match(regex)?.[0]

		if (!parseUrl) {
			return m.reply(`# Cara Penggunaan\n\n` + `> Masukkan URL Instagram untuk mengunduh konten\n\n` + `# Contoh Penggunaan\n` + `> *${usedPrefix + command} https://www.instagram.com/*`)
		}

		const res = await igdl(parseUrl)

		if (res.error) return m.reply('Gagal ambil konten dari Instagram~')

		const result = res.info

		if (res.media_type === 'photo') {
			if (result.length > 1) {
				const medias = result.map((v) => ({
					image: {
						url: v.url,
					},
				}))

				await conn.sendAlbumMessage(m.chat, medias, { quoted: m })
			}

			if (result.length === 1) {
				conn.sendFile(m.chat, result[0].url, '', 'kyah', m)
			}
		} else {
			conn.sendFile(m.chat, result[0].url, '', 'kyah', m)
		}
	} catch (err) {
		console.error('Instagram Error:', err.message)
		m.reply('Ada error waktu ambil media IG-nya~')
	}
}

handler.help = ['igdl']
handler.tags = ['downloader']
handler.command = /^(igdl|instagdramdl)$/i
handler.limit = true

export default handler

async function igdl(url) {
	let data = JSON.stringify({ url, type: 'video' })

	const res = await axios.post('https://vdraw.ai/api/v1/instagram/ins-info', data, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return res.data?.data
}
