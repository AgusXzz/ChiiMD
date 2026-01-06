let handler = async (m, { command, args }) => {
	let user = global.db.data.users[m.sender];
	let type = (args[0] || '').toLowerCase();
	let _type = (args[1] || '').toLowerCase();
	const list = `
╭──『 Makanan 』
│• *Ayambakar*
│• *Ayamgoreng*
│• *Rendang*
│• *Steak*
│• *Babipanggang*
│• *Gulaiayam*
│• *Oporayam*
│• *Ikanbakar*
│• *Lelebakar*
│• *Nilabakar*
│• *Bawalbakar*
│• *Udangbakar*
│• *Pausbakar*
│• *Kepitingbakar*
╰───────────────
`.trim();
	//try {
	if (/makan|eat/i.test(command)) {
		const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count);
		switch (type) {
			case 'ayamgoreng':
				if (user.stamina < 100) {
					if (user.ayamgoreng >= count * 1) {
						user.ayamgoreng -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` Ayam goreng kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			case 'ayambakar':
				if (user.stamina < 100) {
					if (user.ayambakar >= count * 1) {
						user.ayambakar -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` Ayam bakar kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			case 'oporayam':
				if (user.stamina < 100) {
					if (user.oporayam >= count * 1) {
						user.oporayam -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` Opor ayam kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			case 'rendang':
				if (user.stamina < 100) {
					if (user.rendang >= count * 1) {
						user.rendang -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` Rendang kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			case 'steak':
				if (user.stamina < 100) {
					if (user.steak >= count * 1) {
						user.steak -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` Steak kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			case 'gulaiayam':
				if (user.stamina < 100) {
					if (user.gulaiayam >= count * 1) {
						user.gulaiayam -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` Gulai ayam kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			case 'babipanggang':
				if (user.stamina < 100) {
					if (user.babipanggang >= count * 1) {
						user.babipanggang -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` Babi panggang kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			case 'ikanbakar':
				if (user.stamina < 100) {
					if (user.ikanbakar >= count * 1) {
						user.ikanbakar -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` ikan bakar kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			case 'lelebakar':
				if (user.stamina < 100) {
					if (user.lelebakar >= count * 1) {
						user.lelebakar -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` lele bakar kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			case 'nilabakar':
				if (user.stamina < 100) {
					if (user.nilabakar >= count * 1) {
						user.nilabakar -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` nila bakar kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			case 'bawalbakar':
				if (user.stamina < 100) {
					if (user.bawalbakar >= count * 1) {
						user.bawalbakar -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` bawal bakar kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			case 'udangbakar':
				if (user.stamina < 100) {
					if (user.udangbakar >= count * 1) {
						user.udangbakar -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` udang bakar kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			case 'pausbakar':
				if (user.stamina < 100) {
					if (user.pausbakar >= count * 1) {
						user.pausbakar -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` paus bakar kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			case 'kepitingbakar':
				if (user.stamina < 100) {
					if (user.kepitingbakar >= count * 1) {
						user.kepitingbakar -= count * 1;
						user.stamina += 20 * count;
						conn.reply(m.chat, `Nyam nyam`, m);
					} else conn.reply(m.chat, ` kepiting bakar kamu kurang`, m);
				} else conn.reply(m.chat, `Stamina kamu sudah penuh`, m);
				break;
			default:
				conn.reply(m.chat, list, m);
		}
	}
};

handler.help = ['makan'];
handler.tags = ['rpg'];
handler.register = true;
handler.group = true;
handler.command = /^(eat|makan)$/i;
export default handler;
