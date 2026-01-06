let handler = async (m, { conn, args }) => {
	try {
		let user = global.db.data.users[m.sender];
		let type = (args[0] || '').toLowerCase();
		let count = args[1] ? Math.min(5, Math.max(1, parseInt(args[1]))) : 1;

		const menu = `
▧ Ayambakar → 2 Ayam + 1 Coal
▧ Ayamgoreng → 2 Ayam + 1 Coal
▧ Oporayam → 2 Ayam + 1 Coal
▧ Gulaiayam → 2 Ayam + 1 Coal

▧ Steak → 2 Sapi + 1 Coal
▧ Rendang → 2 Sapi + 1 Coal

▧ Babipanggang → 2 Babi + 1 Coal

▧ Ikanbakar → 2 Ikan + 1 Coal
▧ Lelebakar → 2 Lele + 1 Coal
▧ Nilabakar → 2 Nila + 1 Coal
▧ Bawalbakar → 2 Bawal + 1 Coal
▧ Udangbakar → 2 Udang + 1 Coal
▧ Pausbakar → 2 Paus + 1 Coal
▧ Kepitingbakar → 2 Kepiting + 1 Coal
        `;

		let bahan, result;

		switch (type) {
			case 'ayambakar':
			case 'ayamgoreng':
			case 'oporayam':
			case 'gulaiayam':
				bahan = 'ayam';
				result = type;
				break;

			case 'steak':
			case 'rendang':
				bahan = 'sapi';
				result = type;
				break;

			case 'babipanggang':
				bahan = 'babi';
				result = type;
				break;

			case 'ikanbakar':
				bahan = 'ikan';
				result = type;
				break;

			case 'lelebakar':
				bahan = 'lele';
				result = type;
				break;

			case 'nilabakar':
				bahan = 'nila';
				result = type;
				break;

			case 'bawalbakar':
				bahan = 'bawal';
				result = type;
				break;

			case 'udangbakar':
				bahan = 'udang';
				result = type;
				break;

			case 'pausbakar':
				bahan = 'paus';
				result = type;
				break;

			case 'kepitingbakar':
				bahan = 'kepiting';
				result = type;
				break;

			default:
				return conn.reply(m.chat, menu, m);
		}

		if (user[bahan] < count * 2 || user.coal < count) return m.reply(`❗ Bahan tidak cukup\nButuh: *${2 * count} ${bahan}* dan *${count} coal*`);

		user[bahan] -= count * 2;
		user.coal -= count;

		user[result] += count;

		m.reply(m.chat, `✅ Berhasil memasak *${count} ${type}* 🍽️`, m);
	} catch (e) {
		console.log(e);
		m.reply('Error');
	}
};

handler.help = ['masak <makanan> <jumlah>'];
handler.tags = ['rpg'];
handler.command = /^(masak|cook)$/i;
handler.group = true;

export default handler;
