let handler = async (m, { conn, usedPrefix }) => {
	let user = global.db.data.users[m.sender];
	let pemancing = await conn.getName(m.sender);

	try {
		let now = Date.now();
		let cooldown = 240000;
		let diff = now - user.lastfishing;
		let timers = clockString(cooldown - diff);
		if (user.fishingrod <= 0) return m.reply(`*Kamu Tidak Punya Kail Pancingan Dan Umpan 100*`);

		if (user.stamina < 20) return m.reply(`Stamina Kamu Tidak Cukup\nHarap Isi Stamina Kamu Dengan *${usedPrefix}eat*`);

		if (diff < cooldown) return m.reply(`Kamu Masih Kelelahan\nHarap Tunggu *${timers}* Lagi`);

		let nila = Math.floor(Math.random() * 10);
		let bawal = Math.floor(Math.random() * 10);
		let lele = Math.floor(Math.random() * 15);
		let ikan = Math.floor(Math.random() * 30);
		let udang = Math.floor(Math.random() * 39);
		let paus = Math.floor(Math.random() * 2);
		let kepiting = Math.floor(Math.random() * 27);

		setTimeout(() => conn.reply(m.chat, `${pemancing} Sedang Memancing...`, m), 0);
		setTimeout(() => conn.reply(m.chat, `${pemancing} Menunggu..`, m), 8000);
		setTimeout(() => conn.reply(m.chat, `${pemancing} Sepertinya Dapat Sesuatu..`, m), 28000);

		setTimeout(() => {
			let mcng = `
*Hasil Mancing ${pemancing}!*

Nila : ${nila}
Bawal : ${bawal}
Lele : ${lele}
Ikan : ${ikan}
Udang : ${udang}
Paus : ${paus}
Kepiting : ${kepiting}

Kamu Bisa Memasak Ini, Dan Memakannya
_Contoh:_
${usedPrefix}cook
`.trim();

			conn.reply(m.chat, mcng);
		}, 38000);

		user.nila += nila;
		user.ikan += ikan;
		user.lele += lele;
		user.bawal += bawal;
		user.udang += udang;
		user.paus += paus;
		user.kepiting += kepiting;

		user.lastfishing = now;
	} catch (e) {
		conn.reply(m.chat, 'Error', m);
		console.log(e);
	}
};

handler.help = ['mancing'];
handler.tags = ['rpg'];
handler.command = /^(fishing|mancing)$/i;

export default handler;

function clockString(ms) {
	let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
	let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
	let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
	let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
	return ['\n' + d, ' *Hari*\n ', h, ' *Jam*\n ', m, ' *Menit*\n ', s, ' *Detik* '].map((v) => v.toString().padStart(2, 0)).join('');
}
