import { ITEMS, hasItem, addItem, removeItem } from '../lib/rpg.js';

const FOOD = ['meat', 'steak', 'fish_sardine', 'fish_salmon', 'fish_shark'];

let handler = async (m, { args }) => {
	const user = global.db.data.users[m.sender];
	const sub = (args[0] || '').toLowerCase();
	const owned = Object.entries(user.inventory).filter(([id]) => ITEMS[id]?.type === 'pet');
	const eq = user.pet;

	if (!sub) {
		const eqStr = eq
			? `${ITEMS[eq.id].emoji} ${ITEMS[eq.id].name} Lv.${eq.lvl} (${eq.exp}/10 XP)\nBuff: ${statName(ITEMS[eq.id])} +${bonusText(eq)}`
			: 'Tidak ada pet ter-equip. Buka crate mythic/legendary atau .pet equip <pet>';
		const list = owned.map(([id, q]) => `${ITEMS[id].emoji} ${ITEMS[id].name} x${q}`).join('\n') || '-';
		return m.reply(`*PET*\n\n🐾 Ter-equip:\n${eqStr}\n\n*Inventory:*\n${list}\n\nEquip: .pet equip <pet>\nFeed: .pet feed`);
	}

	if (sub === 'equip') {
		const id = (args[1] || '').toLowerCase();
		if (!ITEMS[id] || ITEMS[id].type !== 'pet' || !hasItem(user, id)) return m.reply('Pet tidak ditemukan di inventory.');
		removeItem(user, id);
		if (eq?.id) addItem(user, eq.id);
		user.pet = { id, lvl: 1, exp: 0 };
		return m.reply(`🐾 ${ITEMS[id].emoji} ${ITEMS[id].name} ter-equip!`);
	}

	if (sub === 'feed') {
		if (!eq?.id) return m.reply('Belum ada pet ter-equip.');
		const food = FOOD.find((f) => hasItem(user, f));
		if (!food) return m.reply(`Butuh makanan (${FOOD.map((f) => ITEMS[f].name).join(', ')}) untuk memberi makan pet.`);
		removeItem(user, food);
		eq.exp = (eq.exp || 0) + 1;
		const newLvl = Math.min(10, 1 + Math.floor(eq.exp / 10));
		let txt = `🍖 ${ITEMS[eq.id].emoji} ${ITEMS[eq.id].name} makan ${ITEMS[food].name}! (${eq.exp}/10 XP)`;
		if (newLvl > eq.lvl) {
			eq.lvl = newLvl;
			txt += `\n\n⬆️ *Level up!* Sekarang Lv.${eq.lvl}`;
		}
		return m.reply(txt);
	}

	return m.reply('Sub-perintah: equip / feed');
};

function statName(p) {
	return { crit: 'Crit', def: 'DEF', hp: 'Max HP', atk: 'ATK' }[p.stat] || p.stat;
}

function bonusText(pet) {
	const p = ITEMS[pet.id];
	const mult = 1 + 0.1 * ((pet.lvl || 1) - 1);
	return p.stat === 'crit' ? `${p.bonus}%` : Math.round(p.bonus * mult);
}

handler.help = ['pet'];
handler.tags = ['rpg'];
handler.command = ['pet'];
handler.register = true;

export default handler;
