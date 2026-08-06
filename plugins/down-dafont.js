//elyas_tzy x furqan
//izin wm min
import * as cheerio from 'cheerio';

let handler = async (m, { conn, args }) => {
	let cmd = args[0]?.toLowerCase();

	if (!cmd)
		throw `*Gunakan Salah Satu Command Ini*

1 *.dafont search [nama_font]*
   Untuk mencari font berdasarkan nama.

2 *.dafont dl [link_download]*
   Untuk mengunduh font dari link hasil pencarian.

*Example :*
.dafont search fancy
.dafont dl https://dl.dafont.com/dl/?f=fancy_nancy_2`;

	switch (cmd) {
		case 'search': {
			if (!args[1]) throw 'Mau Cari Apa Di Dafont?';
			const query = args[1];
			try {
				m.reply('🔍 Searching fonts...');

				let result = await dafont(query);
				if (!result.length) throw `Font "${query}" tidak ditemukan`;

				let teks = `*『 DAFONT SEARCH 』*`;

				result.slice(0, 10).forEach((font, i) => {
					teks += `

*${i + 1}. ${font.name}*
✍️ Creator : ${font.creator}
⬇️ Download : ${font.total_down}
🔗 ${font.link}`;
				});

				teks += `\n\nGunakan:\n*.dafont dl [link_download]*`;
				m.reply(teks);
			} catch (e) {
				console.error(e);
				m.reply('❌ Error saat mencari font');
			}
			break;
		}

		case 'dl': {
			if (!args[1]) throw 'Mana Link Nya?';
			const url = args[1];
			if (!url.startsWith('https://dl.dafont.com/')) throw '❌ Link tidak valid';

			try {
				m.reply('⬇️ Downloading font...');

				const res = await fetch(url);

				if (!res.ok) throw `Terjadi kesalahan ${res.statusText}`;

				const buffer = Buffer.from(await res.arrayBuffer());

				const name = url.split('=').pop();
				await conn.sendMessage(
					m.chat,
					{
						document: buffer,
						mimetype: 'application/zip',
						fileName: `${name}.zip`,
					},
					{ quoted: m }
				);
			} catch (e) {
				console.error(e);
				m.reply('❌ Gagal download font');
			}
			break;
		}

		default:
			m.reply('*Subcommand Yang Tersedia :*\n.dafont search\n.dafont dl');
	}
};

async function dafont(query) {
	const res = await fetch('https://www.dafont.com/search.php?q=' + encodeURIComponent(query));

	if (!res.ok) throw new Error(`Status ${res.status}`);

	const data = await res.text();
	const $ = cheerio.load(data);
	const result = [];

	$('.lv1left.dfbg').each((_, el) => {
		const text = $(el).text().replace(/\s+/g, ' ').trim();

		const name = text.split(' by ')[0];
		const creator = text.split(' by ')[1] || '-';

		const total_down = $(el).parent().find('.light').first().text().trim();

		const link = $(el).parent().find('a.dl').attr('href');

		if (link) {
			result.push({
				name,
				creator,
				total_down,
				link: 'https:' + link,
			});
		}
	});

	return result;
}

handler.help = ['dafont'];
handler.tags = ['downloader'];
handler.command = /^dafont$/i;

export default handler;
