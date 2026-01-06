const timeout = 1800000; // 30 menit

let handler = async (m, { usedPrefix, conn }) => {
	const user = global.db.data.users[m.sender];

	const { bibitapel, bibitanggur, bibitmangga, bibitpisang, bibitjeruk } = user;

	if (!bibitapel || !bibitanggur || !bibitmangga || !bibitpisang || !bibitjeruk)
		return m.reply(
			`*Pastikan Kamu Memiliki Semua Bibit*
• Bibit Apel
• Bibit Mangga
• Bibit Jeruk
• Bibit Pisang
• Bibit Anggur

Contoh:
${usedPrefix}shop buy bibitmangga 500`
		);

	const now = Date.now();
	const diff = user.lastberkebon + timeout;

	if (now < diff)
		return m.reply(`
Anda sudah menanam sebelumnya.
Tunggu ${msToTime(diff - now)} lagi.`);

	if (bibitmangga < 500) return m.reply(`Bibit Mangga kamu kurang dari *500*`);
	if (bibitapel < 500) return m.reply(`Bibit Apel kamu kurang dari *500*`);
	if (bibitpisang < 500) return m.reply(`Bibit Pisang kamu kurang dari *500*`);
	if (bibitjeruk < 500) return m.reply(`Bibit Jeruk kamu kurang dari *500*`);
	if (bibitanggur < 500) return m.reply(`Bibit Anggur kamu kurang dari *500*`);

	const [pisangpoin, anggurpoin, manggapoin, jerukpoin, apelpoin] = Array.from({ length: 5 }, () => Math.floor(Math.random() * 500));

	user.pisang += pisangpoin;
	user.anggur += anggurpoin;
	user.mangga += manggapoin;
	user.jeruk += jerukpoin;
	user.apel += apelpoin;

	user.bibitapel -= 500;
	user.bibitanggur -= 500;
	user.bibitmangga -= 500;
	user.bibitpisang -= 500;
	user.bibitjeruk -= 500;

	user.tiketcoin += 1;
	user.lastberkebon = now;

	m.reply(`
Selamat ${conn.getName(m.sender)}!
Kamu mendapatkan:
+${pisangpoin} Pisang
+${manggapoin} Mangga
+${anggurpoin} Anggur
+${jerukpoin} Jeruk
+${apelpoin} Apel

${usedPrefix}listbuah Untuk melihat listnya.`);

	setTimeout(() => {
		m.reply(`Waktunya berkebun lagi kak 🌱`);
	}, timeout);
};

handler.help = ['berkebun'];
handler.tags = ['rpg'];
handler.command = /^berkebun$/i;
handler.group = true;

export default handler;

function msToTime(ms) {
	let s = Math.floor((ms / 1000) % 60);
	let m = Math.floor((ms / (1000 * 60)) % 60);
	let h = Math.floor((ms / (1000 * 60 * 60)) % 24);
	return `${h} Jam ${m} Menit ${s} Detik`;
}
