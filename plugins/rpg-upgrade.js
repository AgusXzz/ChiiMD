import { ITEMS, hasItem, removeItem, fmt, sendBtn, BTN } from '../lib/rpg.js';

const TOOLS = ['pickaxe', 'axe', 'rod'];
const EQ = ['weapon', 'armor', 'accessory'];

let handler = async function (m, { text }) {
	const user = global.db.data.users[m.sender];
	const slot = (text || '').trim().toLowerCase();
	if (![...TOOLS, ...EQ].includes(slot)) {
		return sendBtn(this, m, 'Pilih slot yang mau di-upgrade:', [
			BTN('⚔️ Weapon', '.upgrade weapon'),
			BTN('🛡️ Armor', '.upgrade armor'),
			BTN('💍 Accessory', '.upgrade accessory'),
			BTN('⛏️ Pickaxe', '.upgrade pickaxe'),
			BTN('🪓 Axe', '.upgrade axe'),
			BTN('🎣 Rod', '.upgrade rod'),
		]);
	}

	if (TOOLS.includes(slot)) {
		const t = user.tools[slot];
		if (!t?.id) return m.reply('Alat belum terpasang.');
		const item = ITEMS[t.id];
		const next = Object.keys(ITEMS).find((id) => ITEMS[id].type === 'tool' && ITEMS[id].slot === slot && ITEMS[id].tier === item.tier + 1);
		if (!next) return m.reply('Sudah tier maksimal.');
		const cost = ITEMS[next].price;
		if (user.money < cost) return m.reply(`Butuh 💹 ${fmt(cost)}.`);
		user.money -= cost;
		user.tools[slot] = { id: next, lvl: 1 };
		return m.reply(`${ITEMS[next].emoji} ${ITEMS[next].name} terpasang!`);
	}

	const e = user.equipment[slot];
	if (!e?.id) return m.reply('Equipment slot kosong.');
	if (e.lvl >= 10) return m.reply('Sudah level maksimal.');
	const cost = Math.round(ITEMS[e.id].price * Math.pow(2, e.lvl));
	const mat = slot === 'weapon' ? 'iron' : slot === 'armor' ? 'hide' : 'gem';
	const matQty = e.lvl + 1;
	if (user.money < cost) return m.reply(`Butuh 💹 ${fmt(cost)}.`);
	if (!hasItem(user, mat, matQty)) return m.reply(`Butuh ${ITEMS[mat].name} x${matQty}.`);
	user.money -= cost;
	removeItem(user, mat, matQty);
	const chance = Math.max(40, 100 - e.lvl * 10);
	if (Math.random() * 100 > chance) return m.reply(`❌ Upgrade gagal! Bahan & money hilang.`);
	e.lvl++;
	return m.reply(`✅ ${ITEMS[e.id].emoji} ${ITEMS[e.id].name} naik ke *Lv.${e.lvl}*!`);
};

handler.help = ['upgrade'];
handler.tags = ['rpg'];
handler.command = /^(upgrade)$/i;
handler.register = true;

export default handler;
