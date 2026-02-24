import axios from 'axios';
import { delay } from 'baileys';
import { toAudio } from '../lib/converter.js';

let handler = async (m, { usedPrefix, command, text }) => {
	if (!text) throw `Usage: ${usedPrefix + command} <YouTube Audio URL>`;
	m.react('🔁');
	try {
		const dl = await ytdown(text, 'audio');
		const info = dl.info;
		const sthumb = await conn.adReply(
			m.chat,
			`– 乂 *YouTube - Audio*\n> *- Judul :* ${info.title}\n> *- Channel :* ${info.uploader}\n> *- Durasi :* ${info.duration}\n> *- Views :* ${info.views}\n> *- Size :* ${info.size}`,
			info.thumbnail,
			m,
			{ title: info.title, source: text }
		);
		const { data, ext } = await conn.getFile(dl.download);
		const audios = await toAudio(data, ext);
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
		return m.reply(e.message);
	}
};
handler.help = ['ytmp3'];
handler.tags = ['downloader'];
handler.command = /^(yta|ytmp3|ytaudio)$/i;
handler.limit = true;

export default handler;

export async function ytdown(url, type = 'video') {
	const { data } = await axios.post('https://app.ytdown.to/proxy.php', new URLSearchParams({ url }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

	const api = data.api;
	if (api?.status == 'ERROR') throw new Error(api.message);

	const media = api?.mediaItems?.find((m) => m.type.toLowerCase() === type.toLowerCase());
	if (!media) throw new Error('Media type not found');

	while (true) {
		const { data: res } = await axios.get(media.mediaUrl);

		if (res?.error === 'METADATA_NOT_FOUND') throw new Error('Metadata not found');

		if (res?.percent === 'Completed' && res?.fileUrl !== 'In Processing...') {
			return {
				info: {
					title: api.title,
					desc: api.description,
					thumbnail: api.imagePreviewUrl,
					views: api.mediaStats?.viewsCount,
					uploader: api.userInfo?.name,
					quality: media.mediaQuality,
					duration: media.mediaDuration,
					extension: media.mediaExtension,
					size: media.mediaFileSize,
				},
				download: res.fileUrl,
			};
		}

		await delay(5000);
	}
}
