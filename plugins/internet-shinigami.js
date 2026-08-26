import PDFDocument from 'pdfkit';
import sizeOf from 'image-size';

const BASE = 'https://api.shngm.io/v1';

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
	if (!text) throw '❌ Masukkan judul manhwa';

	const cmd = usedPrefix + command;
	const type = args[0];

	if (type === 'detail') {
		let [id, page = 1] = args[1].split('|');
		page = Number(page);

		const detail = await getJSON(`${BASE}/manga/detail/${id}`);
		const chapters = await getJSON(`${BASE}/chapter/${id}/list?page=${page}&page_size=10&sort_by=chapter_number&sort_order=asc`);

		const d = detail.data;
		const getNames = (key) => d.taxonomy[key].map((v) => v.name).join(', ') || '-';

		const detailText = `
📘 *${d.title}*
🈶 ${d.alternative_title || '-'}

⭐ Rating: *${d.user_rate}*
👀 Views: *${d.view_count.toLocaleString()}*
🏆 Rank: *${d.rank}*

📅 Rilis: *${d.release_year}*
🌍 Negara: *${d.country_id}*

👤 Author: *${getNames('Author')}*
🎨 Artist: *${getNames('Artist')}*
🏷️ Genre: *${getNames('Genre')}*

📝 *Sinopsis*:
${d.description}
`.trim();

		const rows = chapters?.data?.map((v) => ({
			title: `Chapter ${v.chapter_number}`,
			description: new Date(v.release_date).toLocaleDateString('id-ID'),
			id: `${cmd} read ${v.chapter_id}`,
		}));

		if (page > 1) {
			rows.push({
				title: '⬅️ Prev Page',
				description: `Halaman ${page - 1}`,
				id: `${cmd} detail ${id}|${page - 1}`,
			});
		}

		if (page < chapters.meta.total_page) {
			rows.push({
				title: '➡️ Next Page',
				description: `Halaman ${page + 1}`,
				id: `${cmd} detail ${id}|${page + 1}`,
			});
		}

		return conn.sendButton(
			m.chat,
			{
				image: { url: d.cover_image_url },
				text: detailText,
				title: d.title,
				footer: `Page ${page}/${chapters.meta.total_page || '1'}`,
				buttons: [
					{
						name: 'single_select',
						buttonParamsJson: JSON.stringify({
							title: '📖 Pilih Chapter',
							sections: [{ title: 'Daftar Chapter', rows }],
						}),
					},
				],
			},
			{ quoted: m }
		);
	}

	if (type === 'read') {
		try {
			const chapterId = args[1];
			await m.reply('🔁 Membuat PDF...');

			const res = await getJSON(`${BASE}/chapter/detail/${chapterId}`);
			const c = res.data;

			const pdf = await toPDF(c.chapter.data, c.base_url, c.chapter.path);

			return conn.sendMessage(
				m.chat,
				{
					document: pdf,
					mimetype: 'application/pdf',
					fileName: `${c.manga_id}-chapter-${c.chapter_number}.pdf`,
					caption: `📖 Chapter ${c.chapter_number}`,
				},
				{ quoted: m }
			);
		} catch (e) {
			return m.reply(e?.message || e);
		}
	}

	let [query, page = 1] = text.split('|');
	page = Number(page);

	const res = await getJSON(`${BASE}/manga/list?page=${page}&page_size=15&q=${encodeURIComponent(query)}`);

	if (!res.data?.length) throw `"${query}" tidak ditemukan`;

	const rows = res.data.map((v) => ({
		title: v.title,
		description: `⭐ ${v.user_rate} | 👀 ${v.view_count.toLocaleString()}`,
		id: `${cmd} detail ${v.manga_id}|1`,
	}));

	if (page > 1) {
		rows.push({
			title: '⬅️ Prev Page',
			description: `Halaman ${page - 1}`,
			id: `${cmd} ${query}|${page - 1}`,
		});
	}

	if (page < res.meta.total_page) {
		rows.push({
			title: '➡️ Next Page',
			description: `Halaman ${page + 1}`,
			id: `${cmd} ${query}|${page + 1}`,
		});
	}

	return conn.sendButton(
		m.chat,
		{
			text: `🔎 *Hasil Pencarian* "${query}"\n${res.data.length} ditemukan`,
			title: 'MANHWA SEARCH',
			footer: `Page ${page}/${res.meta.total_page}`,
			buttons: [
				{
					name: 'single_select',
					buttonParamsJson: JSON.stringify({
						title: '📚 Pilih Manhwa',
						sections: [{ title: 'Hasil', rows }],
					}),
				},
			],
		},
		{ quoted: m }
	);
};

handler.help = ['shinigami'];
handler.tags = ['internet'];
handler.command = ['shinigami'];
export default handler;

async function getJSON(url) {
	const res = await fetch(url);
	if (!res.ok) throw `Fetch error ${res.status} ${res.statusText}`;
	return res.json();
}

async function getBuffer(url) {
	const res = await fetch(url, {
		headers: {
			'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
		},
	});

	if (!res.ok) {
		throw `Image fetch error ${res.status} ${res.statusText}`;
	}

	return Buffer.from(await res.arrayBuffer());
}

function drawImageAutoSize(doc, img) {
	const { width, height } = sizeOf(img);
	doc.addPage({ size: [width, height], margin: 0 });
	doc.image(img, 0, 0, { width, height });
}

async function toPDF(images, baseUrl, path) {
	const doc = new PDFDocument({ autoFirstPage: false });
	const buffers = [];
	const MAX_PAGES = 50;

	doc.on('data', (b) => buffers.push(b));

	for (const imgName of images.slice(0, MAX_PAGES)) {
		if (/\.(webp|gif)$/i.test(imgName)) continue;
		const img = await getBuffer(`${baseUrl}${path}${imgName}`);
		drawImageAutoSize(doc, img);
	}

	doc.end();

	await new Promise((resolve, reject) => {
		doc.on('end', resolve);
		doc.on('error', reject);
	});

	return Buffer.concat(buffers);
}
