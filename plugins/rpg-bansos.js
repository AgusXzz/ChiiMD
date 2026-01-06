let handler = async (m) => {
	try {
		const user = global.db.data.users[m.sender];
		const randomAku = Math.floor(Math.random() * 101);
		const randomKamu = Math.floor(Math.random() * 81);

		const now = Date.now();
		const cooldown = 604800000;
		const diff = now - user.lastbansos;
		const timers = clockString(cooldown - diff);

		if (diff < cooldown) return m.reply(`Kamu Sudah Melakukan Korupsi Keuangan!\nTunggu Selama:\n${timers}\nAgar Tidak Tertangkap Oleh KPK`);
		if (randomAku > randomKamu) {
			m.reply('Kamu Tertangkap Setelah Kamu Korupsi Dana Rakyat,\nDan Kamu Harus Membayar Denda Sebesar *Rp. 5.000.000* Agar Bisa Terbebas Dari Penjara');
			user.money -= 5000000;
			user.lastbansos = now;
		} else if (randomAku < randomKamu) {
			user.money += 2000000;
			m.reply('Kamu Berhasil Korupsi Dana Rakyat!\nKamu Mendapatkan *Rp. 2.000.000*');
			user.lastbansos = now;
		} else {
			m.reply('Kamu Tidak Berhasil Melakukan Korupsi,\nTetapi Kamu Tidak Masuk Penjara Karena Kamu *Menyuap Pihak Tertentu*.');
			user.lastbansos = now;
		}
	} catch (e) {
		console.error(e);
		m.reply('Error');
	}
};

handler.help = ['korupsi'];
handler.tags = ['rpg'];
handler.command = /^(korupsi)$/i;
handler.group = true;

export default handler;

function clockString(ms) {
	let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
	let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
	let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
	let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
	return ['\n' + d, ' *Hari*\n ', h, ' *Jam*\n ', m, ' *Menit*\n ', s, ' *Detik* '].map((v) => v.toString().padStart(2, 0)).join('');
}
