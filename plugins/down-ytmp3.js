import { isYouTubeUrl, getInfo, getAudioUrl } from '../lib/ytdl.js';
import { toAudio } from '../lib/converter.js';

const handler = async (m, { usedPrefix, command, text }) => {
	if (!text) throw `Usage: ${usedPrefix + command} <YouTube URL>`;
	if (!isYouTubeUrl(text)) throw '❌ URL bukan YouTube yang valid.';
	m.react('🔁');
	try {
		const info = await getInfo(text);
		const audioUrl = await getAudioUrl(text);

		const sthumb = await conn.adReply(
			m.chat,
			`– 乂 *YouTube - Audio*\n> *- Judul :* ${info.title}\n> *- Channel :* ${info.uploader}\n> *- Durasi :* ${info.duration}\n> *- Views :* ${info.views}`,
			info.thumbnail,
			m,
			{ title: info.title, source: text }
		);

		const res = await fetch(audioUrl);
		const buffer = Buffer.from(await res.arrayBuffer());
		const audios = await toAudio(buffer, 'm4a');
		await conn.sendMessage(
			m.chat,
			{
				audio: audios.data,
				mimetype: 'audio/mpeg',
				fileName: `${info.title}.mp3`,
			},
			{ quoted: sthumb }
		);
	} catch (e) {
		console.error(e);
		return m.reply('❌ Gagal mengunduh audio. Coba lagi nanti.');
	}
};
handler.help = ['ytmp3'];
handler.tags = ['downloader'];
handler.command = /^(yta|ytmp3|ytaudio)$/i;
handler.limit = true;

export default handler;
