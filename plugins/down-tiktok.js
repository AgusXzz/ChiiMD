let handler = async (m, { text, usedPrefix, command }) => {
	try {
		const input = m.quoted ? m.quoted.text : text;
		const regex = /(https:\/\/(vt|vm)\.tiktok\.com\/[^\s]+|https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+)/;

		const parseUrl = input.match(regex)?.[0];
		if (parseUrl) {
			m.reply('🔁');
			let res = await (await fetch(`https://www.tikwm.com/api/?url=${parseUrl}&hd=1`)).json();
			if (!res || !res.data) return m.reply('Gagal mengambil data dari TikTok.');

			let data = res.data;
			await m.reply(`# *TIKTOK DOWNLOADER*

> *Judul*: ${data.title}
> *Region*: ${data.region}
> *Durasi*: ${formatDuration(data.duration)}
> *Views*: ${formatNumber(data.play_count)}
> *Komentar*: ${formatNumber(data.comment_count)}
> *Share*: ${formatNumber(data.share_count)}
> *Uploader*: ${data.author.nickname || data.author.unique_id}

Mengirim.....`);

			if (data.images && data.images.length > 0) {
				if (data.images.length < 2) {
					for (let img of data.images) {
						await conn.sendFile(m.chat, img, '', '', m);
					}
				} else {
					let media = data.images.map((img) => ({
						image: { url: img },
					}));
					await conn.sendAlbumMessage(m.chat, media, { quoted: m });
				}
			} else {
				await conn.sendFile(m.chat, data.play, '', '', m);
			}

			if (data.music_info.play) {
				await conn.sendMessage(
					m.chat,
					{
						audio: { url: data.music_info.play },
						mimetype: 'audio/mpeg',
						fileName: `${data.title}.mp3`,
					},
					{ quoted: m }
				);
			} else {
				m.reply('Musik tidak ditemukan, hanya akan mengirimkan media itu saja.');
			}
		} else if (input) {
			let search = await (await fetch(`https://www.tikwm.com/api/feed/search?keywords=${input}&count=1&cursor=0&web=1&hd=1`)).json();
			let video = search?.data?.videos[0];
			if (!video) return m.reply(`Video tidak ditemukan untuk pencarian "${input}".`);

			let caption = `# *TIKTOK PLAYER*

> *Judul:* ${video.title}
> *Region:* ${video.region}
> *Durasi:* ${formatDuration(video.duration)}
> *Views:* ${formatNumber(video.play_count)}
> *Komentar:* ${formatNumber(video.comment_count)}
> *Share:* ${formatNumber(video.share_count)}
> *Uploader:* ${video.author.nickname || video.author.unique_id}
`.trim();
			conn.sendFile(m.chat, 'https://www.tikwm.com' + video.play, '', caption, m);
		} else {
			let cmd = usedPrefix + command;
			m.reply(`*TIKTOK DOWNLOADER*
> _*• Search:*_ \`${cmd} [query]\`
> _*• Download:*_ \`${cmd} [link]\`

*C O N T O H:*
> *• ${cmd}* cosplayer
> *• ${cmd}* \`https://vt.tiktok.com/xxxxx\``);
		}
	} catch (err) {
		console.error(err);
		return m.reply('Terjadi kesalahan saat memproses permintaan');
	}
};

handler.help = ['tiktok'];
handler.tags = ['downloader'];
handler.command = /^(ttdl|tiktok|tt|tiktokdl)$/i;
handler.limit = true;

export default handler;

function formatNumber(number) {
	return number.toLocaleString();
}

function formatDuration(seconds) {
	if (!seconds) return '00:00';
	const m = Math.floor(seconds / 60)
		.toString()
		.padStart(2, '0');
	const s = Math.floor(seconds % 60)
		.toString()
		.padStart(2, '0');
	return `${m}:${s}`;
}
