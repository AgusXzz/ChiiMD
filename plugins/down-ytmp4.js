import axios from 'axios'

let handler = async (m, { usedPrefix, command, text }) => {
	if (!text) throw `Usage: ${usedPrefix + command} <YouTube Video URL>`
	try {
		const dl = await ytdlp('audio', text)
		const info = await getMetadata(text)
		const sthumb = await conn.sendMessage(
			m.chat,
			{
				text: `– 乂 *YouTube - Video*\n> *- Judul :* ${info.title}\n> *- Channel :* ${info.channelTitle}\n> *- Upload Date :* ${new Date(info.publishedAt).toLocaleString()}\n> *- Durasi :* ${info.duration}\n> *- Views :* ${info.viewCount}\n> *- Likes :* ${info.likeCount}\n> *- Description :* ${info.description}`,
				contextInfo: {
					externalAdReply: {
						title: info.title,
						thumbnailUrl: info.thumbnails.maxres,
						mediaType: 1,
						renderLargerThumbnail: true,
						sourceUrl: text,
					},
				},
			},
			{ quoted: m }
		)

		await conn.sendMessage(
			m.chat,
			{
				video: { url: dl },
				fileName: `${info.title}.mp4`,
			},
			{ quoted: sthumb }
		)
	} catch (e) {
		m.reply(e.message)
	}
}
handler.help = ['ytmp4']
handler.tags = ['downloader']
handler.command = /^(ytv|ytmp4|ytvideo)$/i
handler.limit = true

export default handler

async function ytdlp(type = 'audio', videoUrl) {
	const cmd = type === 'audio' ? '-x --audio-format mp3' : '-f 136+140'
	const res = await axios.get(`https://ytdlp.online/stream?command=${encodeURIComponent(`${cmd} ${videoUrl}`)}`, {
		responseType: 'stream',
	})

	let data = ''
	for await (const chunk of res.data) data += chunk

	const match = data.match(/href="([^"]+\.(?:mp3|mp4|m4a|webm))"/)
	if (!match) throw new Error('Link download tidak ditemukan')

	return 'https://ytdlp.online' + match[1]
}

async function getMetadata(url) {
	const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
	if (!match) throw new Error('Link Youtube tidak valid')

	const res = await axios.post(
		'https://www.terrific.tools/api/youtube/get-video-metadata',
		{
			videoId: match[1],
		},
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)

	return res.data
}
