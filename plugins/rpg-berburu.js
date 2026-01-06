let handler = async (m) => {
	const user = global.db.data.users[m.sender];
	const cooldown = 500000;
	const now = Date.now();
	const diff = now - user.lastberburu;

	if (diff < cooldown) return m.reply(`*Sepertinya Kamu Sudah Kecapean*\n*Silahkan Istirahat Dulu Selama* ${clockString(cooldown - diff)}`);

	const [rbrb1, rbrb2, rbrb3, rbrb4, rbrb5, rbrb6, rbrb7, rbrb8, rbrb9, rbrb10, rbrb11, rbrb12] = Array.from({ length: 12 }, () => Math.floor(Math.random() * 9) + 1);

	const hsl = `Hasil Berburu

 🐂 > ${rbrb1}              🐃 > ${rbrb7}
 🐅 > ${rbrb2}              🐮 > ${rbrb8}
 🐘 > ${rbrb3}              🐒 > ${rbrb9}
 🐐 > ${rbrb4}              🐗 > ${rbrb10}
 🐼 > ${rbrb5}              🐖 > ${rbrb11}
 🐊 > ${rbrb6}              🐓 > ${rbrb12}

*Ketik: .kandang Untuk Melihat Hasilnya*
`;

	user.banteng += rbrb1;
	user.harimau += rbrb2;
	user.gajah += rbrb3;
	user.kambing += rbrb4;
	user.panda += rbrb5;
	user.buaya += rbrb6;
	user.kerbau += rbrb7;
	user.sapi += rbrb8;
	user.monyet += rbrb9;
	user.babihutan += rbrb10;
	user.babi += rbrb11;
	user.ayam += rbrb12;

	m.reply('Sedang Mencari Mangsa..');
	setTimeout(() => m.reply('Kamu Mendapatkan Mangsa Dan Menunggu Waktu Yang Tepat Untuk Memangsa'), 14000);
	setTimeout(() => m.reply('Duarrrr M*m*k, Kamu Adu Mekanik Dengan Buruanmu Di Exp Lane'), 15000);
	setTimeout(() => m.reply('Nah Ini Dia...\n\nKamu Menang Adu Mekanik, Walau Buruanmu Menggunakan Immortal :v'), 18000);
	setTimeout(() => m.reply(hsl), 20000);

	user.lastberburu = now;
};

handler.help = ['berburu'];
handler.tags = ['rpg'];
handler.command = /^(berburu)$/i;
handler.group = true;
export default handler;

function clockString(ms) {
	let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
	let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
	let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
	let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
	return ['\n' + d, ' *Hari*\n ', h, ' *Jam*\n ', m, ' *Menit*\n ', s, ' *Detik* '].map((v) => v.toString().padStart(2, 0)).join('');
}
