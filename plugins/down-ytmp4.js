import { ytdown } from './down-ytmp3.js';

let handler = async (m, { usedPrefix, command, text }) => {
	if (!text) throw `Usage: ${usedPrefix + command} <YouTube Video URL>`;
	m.react('🔁');
	try {
		const dl = await ytdown(text, 'video');
		const info = dl.info;
		const sthumb = await conn.adReply(
			m.chat,
			`– 乂 *YouTube - Video*\n> *- Judul :* ${info.title}\n> *- Channel :* ${info.uploader}\n> *- Durasi :* ${info.duration}\n> *- Views :* ${info.views}\n> *- Size :* ${info.size}`,
			info.thumbnail,
			m,
			{ title: info.title, source: text }
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
