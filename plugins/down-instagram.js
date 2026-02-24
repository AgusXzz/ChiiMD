let handler = async (m, { text, usedPrefix, command }) => {
	try {
		const input = m.quoted ? m.quoted.text : text;
		const regex = /(https?:\/\/(?:www\.)?instagram\.com\/(p|reel)\/[a-zA-Z0-9_-]+\/?)/;
		const parseUrl = input.match(regex)?.[0];

		if (!parseUrl) throw `# Cara Penggunaan\n\n` + `> Masukkan URL Instagram untuk mengunduh konten\n\n` + `# Contoh Penggunaan\n` + `> *${usedPrefix + command} https://www.instagram.com/*`;

		const res = await igdl(parseUrl);

		if (res.error) throw 'Gagal ambil konten dari Instagram~';

		const result = res.info;

		if (res.media_type === 'photo') {
			if (result.length > 1) {
				const medias = result.map((v) => ({
					image: {
						url: v.url,
					},
				}));

				await conn.sendAlbumMessage(m.chat, medias, { quoted: m });
			}

			if (result.length === 1) {
				conn.sendFile(m.chat, result[0].url, '', 'kyah', m);
			}
		} else {
			conn.sendFile(m.chat, result[0].url, '', 'kyah', m);
		}
	} catch (err) {
		console.error('Instagram Error:', err.message);
		m.reply('Ada error waktu ambil media IG-nya~');
	}
};

handler.help = ['igdl'];
handler.tags = ['downloader'];
handler.command = /^(igdl|instagdramdl)$/i;
handler.limit = true;

export default handler;

async function igdl(url) {
	const res = await fetch('https://vdraw.ai/api/v1/instagram/ins-info', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			url,
			type: 'video',
		}),
	});

	if (!res.ok) {
		throw new Error(`HTTP error! Status: ${res.status}`);
	}

	const json = await res.json();
	return json?.data;
}
