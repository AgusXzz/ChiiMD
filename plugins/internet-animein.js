import axios from 'axios';
class Animein {
	constructor() {
		this.baseUrl = 'https://animeinweb.com';
	}

	async request(url, buffer = false) {
		const res = await axios.get(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36 OPR/95.0.0.0',
				Referer: this.baseUrl,
				maxContentLength: Infinity,
				maxBodyLength: Infinity,
			},
			responseType: buffer ? 'arraybuffer' : 'json',
		});
		if (res.status !== 200) throw 'Terjadi kesalahan saat mengambil data';

		return buffer ? Buffer.from(res.data) : res.data?.data;
	}

	async schedule(day = 'senin') {
		day = day.toLowerCase();
		const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
		if (!days.includes(day)) throw 'Hari tidak valid.\nList: ' + days.join(', ');

		return this.request(`${this.baseUrl}/api/proxy/3/2/schedule/data?day=${day}`);
	}

	async search(keyword, page = 0, sort = 'views') {
		const query = new URLSearchParams({
			page,
			sort,
			keyword,
		}).toString();
		return this.request(`${this.baseUrl}/api/proxy/3/2/explore/movie?${query}`);
	}

	async getAnimeDetail(id) {
		return this.request(`${this.baseUrl}/api/proxy/3/2/movie/detail/${id}`);
	}

	async getEpisodes(id, page = 0) {
		const data = await this.request(`${this.baseUrl}/api/proxy/3/2/movie/episode/${id}?page=${page}`);
		return data?.episode ?? [];
	}

	async getEpisodeStream(id) {
		return this.request(`${this.baseUrl}/api/proxy/3/2/episode/streamnew/${id}`);
	}
}

const animein = new Animein();
const handler = async (m, { conn, text, args, usedPrefix, command }) => {
	const cmd = usedPrefix + command;
	const type = args[0];

	if (!text)
		throw `Contoh:
${cmd} zero no tsukaima
${cmd} schedule(Jadwal Rilis)`;

	if (type === 'schedule') {
		const day = args[1] || new Date().toLocaleString('id-ID', { weekday: 'long' });
		const res = await animein.schedule(day);

		let teks = `*Anime Schedule ${day.toUpperCase()}*\n\n`;

		res.movie.forEach((v, i) => {
			teks += `${i + 1}. *${v.title}*\n`;
			teks += `*Status* : ${v.status}\n`;
			teks += `*Genre* : ${v.genre}\n`;
			teks += `*Type* : ${v.type}\n`;
			teks += `*Views* : ${v.views}\n`;
			teks += `*Time* : ${v.time}\n`;
		});

		return m.reply(teks.trim());
	}

	if (type === 'detail') {
		let [id, page = 1] = args[1].split('|');
		page = Number(page);

		const detail = await animein.getAnimeDetail(id);
		const episodes = await animein.getEpisodes(id, page - 1);

		const d = detail.movie;
		const buff = await animein.request(d.image_poster, true);

		const detailText = `
🎬 *${d.title}*

📺 Type   : ${d.type}
📊 Status : ${d.status}
📅 Year   : ${d.year}
🏢 Studio : ${d.studio}
🏷️ Genre  : ${d.genre}

📝 *Synopsis*:
${d.synopsis}
`.trim();

		const rows = episodes.map((v) => ({
			title: `Episode ${v.index}`,
			description: `ID: ${v.id}`,
			id: `${cmd} getDL ${v.id}`,
		}));

		if (page > 1) {
			rows.push({
				title: '⬅️ Prev Page',
				description: `Halaman ${page - 1}`,
				id: `${cmd} detail ${id}|${page - 1}`,
			});
		}

		if (episodes.length >= 13) {
			rows.push({
				title: '➡️ Next Page',
				description: `Halaman ${page + 1}`,
				id: `${cmd} detail ${id}|${page + 1}`,
			});
		}

		return conn.sendButton(
			m.chat,
			{
				image: buff,
				text: detailText,
				title: d.title,
				footer: `Page ${page}`,
				buttons: [
					{
						name: 'single_select',
						buttonParamsJson: JSON.stringify({
							title: '📺 Pilih Episode',
							sections: [{ title: 'Daftar Episode', rows }],
						}),
					},
				],
			},
			{ quoted: m }
		);
	}

	if (type === 'getDL') {
		const data = await animein.getEpisodeStream(args[1]);

		if (!data?.episode) throw 'Episode tidak ditemukan';

		const ep = data.episode;

		const streamText = `
🎬 *${ep.title}*
📺 Episode : ${ep.index}
👀 Views   : ${ep.views}
📅 Rilis   : ${ep.key_time}

Silakan pilih kualitas:
`.trim();

		let rows = data.server
			.filter((v) => v.type === 'direct')
			.map((v) => ({
				title: `Quality ${v.quality}`,
				description: `Server: ${v.name}`,
				id: `${cmd} play ${encodeURIComponent(v.link)}`,
			}));

		if (!rows.length) {
			rows = data.server.map((v) => ({
				title: `Quality ${v.quality}`,
				description: `Server: ${v.name}`,
				id: `${cmd} play ${encodeURIComponent(v.link)}`,
			}));
		}

		return conn.sendButton(
			m.chat,
			{
				text: streamText,
				title: ep.title,
				footer: 'Pilih kualitas video',
				buttons: [
					{
						name: 'single_select',
						buttonParamsJson: JSON.stringify({
							title: '🎥 Pilih Quality',
							sections: [{ title: 'Available Server', rows }],
						}),
					},
					{
						name: 'quick_reply',
						buttonParamsJson: JSON.stringify({
							display_text: '🔙 Kembali ke Detail',
							id: `${cmd} detail ${ep.id_movie}|1`,
						}),
					},
				],
			},
			{ quoted: m }
		);
	}

	if (type === 'play') {
		const buff = await animein.request(decodeURIComponent(args[1]), true);

		return conn.sendMessage(
			m.chat,
			{
				document: buff,
				mimetype: 'video/mp4',
				fileName: 'video.mp4',
				caption: '🎥 Streaming Video',
			},
			{ quoted: m }
		);
	}

	let [query, page = 1] = text.split('|');
	page = Number(page);

	const res = await animein.search(query, page - 1);

	if (!res.movie?.length) throw `"${query}" tidak ditemukan`;

	const rows = res.movie.slice(0, 15).map((v) => ({
		title: v.title,
		description: `📅 ${v.year} | 📊 ${v.status}`,
		id: `${cmd} detail ${v.id}|1`,
	}));

	if (page > 1) {
		rows.push({
			title: '⬅️ Prev Page',
			description: `Halaman ${page - 1}`,
			id: `${cmd} ${query}|${page - 1}`,
		});
	}

	if (res.movie.length >= 15) {
		rows.push({
			title: '➡️ Next Page',
			description: `Halaman ${page + 1}`,
			id: `${cmd} ${query}|${page + 1}`,
		});
	}

	return conn.sendButton(
		m.chat,
		{
			text: `🔎 *Hasil Pencarian* "${query}"\n${res.movie.length} ditemukan`,
			title: 'ANIME SEARCH',
			footer: `Page ${page}`,
			buttons: [
				{
					name: 'single_select',
					buttonParamsJson: JSON.stringify({
						title: '📚 Pilih Anime',
						sections: [{ title: 'Hasil Pencarian', rows }],
					}),
				},
			],
		},
		{ quoted: m }
	);
};

handler.command = ['animein'];
handler.help = ['animein'];
handler.tags = ['internet'];

export default handler;
