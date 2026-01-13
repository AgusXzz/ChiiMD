let handler = async (m) => {
	try {
		const raw = await fetch('https://api.github.com/repos/AgusXzz/ChiiMD');
		if (!raw.ok) return m.reply('Gagal Mendapatkan Info Repository');
		const res = await raw.json();

		m.reply(`*Informasi Script*\n
✨ *Nama:* ${res.name}
👤 *Pemilik:* ${res.owner.login ?? '-'}
⭐ *Star:* ${res.stargazers_count ?? 0}
🍴 *Forks:* ${res.forks ?? 0}
📅 *Dibuat sejak:* ${toTime(res.created_at)}
♻️ *Terakhir update:* ${toTime(res.updated_at)}
🚀 *Terakhir publish:* ${toTime(res.pushed_at)}
🔗 *Link:* ${res.html_url}
`);
	} catch (err) {
		console.error(err);
		return m.reply('Coba lagi nanti.');
	}
};

handler.help = ['script'];
handler.tags = ['info'];
handler.command = ['sc', 'script', 'esce'];

export default handler;

function toTime(time) {
	const ts = new Date(time).getTime();
	const now = Date.now();
	const diff = Math.floor((now - ts) / 1000);

	const m = Math.floor(diff / 60);
	const h = Math.floor(diff / 3600);
	const d = Math.floor(diff / 86400);
	const mn = Math.floor(diff / 2592000);
	const y = Math.floor(diff / 31536000);

	if (diff < 60) return `${diff} detik yang lalu`;
	if (m < 60) return `${m} menit yang lalu`;
	if (h < 24) return `${h} jam yang lalu`;
	if (d < 30) return `${d} hari yang lalu`;
	if (mn < 12) return `${mn} bulan yang lalu`;
	return `${y} tahun yang lalu`;
}
