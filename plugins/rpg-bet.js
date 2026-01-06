let confirm = {};

async function handler(m, { conn, args }) {
	if (m.sender in confirm) throw 'Kamu masih melakukan judi, tunggu sampai selesai!';

	try {
		let user = global.db.data.users[m.sender];
		let jumlah = args[0] && number(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : /all/i.test(args[0]) ? Math.floor(user.money) : 1;

		if (user.money < jumlah) return m.reply('Uang kamu tidak cukup!');

		confirm[m.sender] = {
			count: jumlah,
			timeout: setTimeout(() => {
				m.reply('Waktu habis! Judi dibatalkan.');
				delete confirm[m.sender];
			}, 60_000),
		};

		conn.reply(m.chat, `Apakah kamu yakin ingin judi?\n\n*Taruhan:* ${jumlah}\nWaktu: 60 detik\nBalas *Iya* untuk lanjut, *Tidak* untuk batal.`, m);
	} catch (e) {
		console.error(e);
		if (m.sender in confirm) {
			clearTimeout(confirm[m.sender].timeout);
			delete confirm[m.sender];
		}
		m.reply('Terjadi kesalahan (dibatalkan).');
	}
}

handler.before = async (m) => {
	if (!(m.sender in confirm)) return;
	if (m.isBaileys) return;

	let session = confirm[m.sender];
	let user = global.db.data.users[m.sender];
	let txt = (m.msg?.selectedDisplayText || m.text || '').trim().toLowerCase();

	// Jawaban YA
	if (/^(iya|ya|y|yes)$/i.test(txt)) {
		clearTimeout(session.timeout);

		let taruhan = session.count;

		let bot = Math.ceil(Math.random() * 91);
		let kamu = Math.floor(Math.random() * 71);

		let status;
		let text;

		if (kamu > bot) {
			user.money += taruhan;
			status = 'Menang';
			text = `Mendapatkan Uang Sebesar *+${taruhan}*`;
		} else if (kamu < bot) {
			user.money -= taruhan;
			status = 'Kalah';
			text = `Kehilangan Uang Sebesar *-${taruhan}*`;
		} else {
			let bonus = Math.floor(taruhan / 1.5);
			user.money += bonus;
			status = 'Seri';
			text = `Mendapatkan Uang *+${bonus}*`;
		}

		m.reply(
			`
*Bot:*   ${bot}
*Kamu:* ${kamu}

Kamu *${status}*, Kamu ${text}
            `.trim()
		);

		delete confirm[m.sender];
		return true;
	}

	// Jawaban TIDAK
	if (/^(tidak|n|no|ga|gak)$/i.test(txt)) {
		clearTimeout(session.timeout);
		delete confirm[m.sender];
		m.reply('Dibatalkan.');
		return true;
	}

	// Jika menjawab tapi bukan "iya/tidak", abaikan
};

handler.help = ['judi'];
handler.tags = ['rpg'];
handler.command = /^(judi|bet)$/i;

export default handler;

function number(x = 0) {
	x = parseInt(x);
	return !isNaN(x) && typeof x == 'number';
}
