import { isYouTubeUrl, getInfo, getVideoUrl } from '../lib/ytdl.js';

let handler = async (m, { usedPrefix, command, text }) => {
	if (!text) throw `Usage: ${usedPrefix + command} <YouTube Video URL>`;
	if (!isYouTubeUrl(text)) throw '❌ URL bukan YouTube yang valid.';
	m.react('🔁');
	try {
		const info = await getInfo(text);
		if (info.durationSec > 3600) throw '❌ Video terlalu panjang (maksimal 1 jam).';
		const videoUrl = await getVideoUrl(text);

		await conn.adReply(
			m.chat,
			`– 乂 *YouTube - Video*\n> *- Judul :* ${info.title}\n> *- Channel :* ${info.uploader}\n> *- Durasi :* ${info.duration}\n> *- Views :* ${info.views}`,
			info.thumbnail,
			m,
			{ title: info.title, source: text }
		);

		await conn.sendMessage(
			m.chat,
			{
				video: { url: videoUrl },
				fileName: `${info.title}.mp4`,
				caption: `*${info.title}*\n> ${info.uploader} | ${info.duration}`,
			},
			{ quoted: m }
		);
	} catch (e) {
		console.error(e);
		return m.reply(e.message?.startsWith('❌') ? e.message : '❌ Gagal mengunduh video. Coba lagi nanti.');
	}
};
handler.help = ['ytmp4'];
handler.tags = ['downloader'];
handler.command = /^(ytv|ytmp4|ytvideo)$/i;
handler.limit = true;

export default handler;
