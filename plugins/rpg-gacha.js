import { ITEMS, hasItem, addItem, removeItem, crateRandom, sendBtn, BTN, fmt } from '../lib/rpg.js';

let handler = async function (m, { text }) {
	const user = global.db.data.users[m.sender];
	const arg = (text || '').trim().toLowerCase();

	if (!arg) {
		const have = Object.entries(user.inventory).filter(([id]) => ITEMS[id]?.type === 'crate');
		if (!have.length) return m.reply('Kamu tidak punya crate.');
		return sendBtn(
			this,
			m,
			'Pilih crate untuk dibuka:',
			have.map(([id, qty]) => BTN(`${ITEMS[id].emoji} ${ITEMS[id].name} x${qty}`, `.open ${id}`))
		);
	}

	const item = ITEMS[arg];
	if (!item || item.type !== 'crate' || !hasItem(user, arg)) return m.reply('Crate tidak ditemukan.');
	removeItem(user, arg);
	const reward = crateRandom(arg);
	if (ITEMS[reward]?.type === 'pet') {
		if (user.pet) {
			addItem(user, reward);
			return m.reply(
				`${item.emoji} Membuka *${item.name}*...\n\n🐾 Kamu mendapat ${ITEMS[reward].emoji} *${ITEMS[reward].name}* (tersimpan di inventory, equip dengan \`.pet equip ${reward}\`)`
			);
		}
		user.pet = { id: reward, lvl: 1, exp: 0 };
		return m.reply(`${item.emoji} Membuka *${item.name}*...\n\n🐾 Kamu mendapat ${ITEMS[reward].emoji} *${ITEMS[reward].name}* dan otomatis ter-equip! Lihat dengan \`.pet\``);
	}
	addItem(user, reward);
	return m.reply(
		`${item.emoji} Membuka *${item.name}*...\n\n🎁 Kamu mendapat:\n${ITEMS[reward].emoji} *${ITEMS[reward].name}*${ITEMS[reward].price ? ` (harga jual 💹 ${fmt(ITEMS[reward].price)})` : ''}`
	);
};

handler.help = ['open'];
handler.tags = ['rpg'];
handler.command = /^(open|buka|gacha)$/i;
handler.register = true;

export default handler;
