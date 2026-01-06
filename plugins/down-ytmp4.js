import { ytdown, getMetadata } from './down-ytmp3.js';

let handler = async (m, { usedPrefix, command, text }) => {
	if (!text) throw `Usage: ${usedPrefix + command} <YouTube Video URL>`;
	try {
		const dl = await ytdown(text, 'video');
		const info = await getMetadata(text);
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
		);

		await conn.sendMessage(
			m.chat,
			{
				video: { url: dl.download },
				fileName: `${info.title}.mp4`,
			},
			{ quoted: sthumb }
		);
	} catch (e) {
		return m.reply(e.message);
	}
};
handler.help = ['ytmp4'];
handler.tags = ['downloader'];
handler.command = /^(ytv|ytmp4|ytvideo)$/i;
handler.limit = true;

export default handler;
