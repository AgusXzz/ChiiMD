import { RECIPES, ITEMS, hasItem, addItem, removeItem, fmt } from '../lib/rpg.js';

const handler = async (m, { command, text }) => {
	const user = global.db.data.users[m.sender];
	if (command === 'recipes') {
		const list = RECIPES.map((r) => `${ITEMS[r.result].emoji} ${r.name} — ${r.need.map(([id, q]) => `${ITEMS[id].name} x${q}`).join(', ')}${r.money ? ` + 💹 ${fmt(r.money)}` : ''}`).join('\n');
		return m.reply(`*RESEP CRAFT*\n\n${list}\n\nCraft: .craft <nama>`);
	}
	const r = RECIPES.find((x) => x.name.toLowerCase() === text.trim().toLowerCase() || x.result === text.trim().toLowerCase());
	if (!r) return m.reply('Resep tidak ditemukan. Lihat .recipes');
	for (const [id, q] of r.need) if (!hasItem(user, id, q)) return m.reply(`Kurang ${ITEMS[id].name} x${q}.`);
	if (r.money && user.money < r.money) return m.reply(`Butuh 💹 ${fmt(r.money)}.`);
	for (const [id, q] of r.need) removeItem(user, id, q);
	if (r.money) user.money -= r.money;
	addItem(user, r.result);
	user.exp += 15;
	return m.reply(`🔨 Craft ${ITEMS[r.result].emoji} ${ITEMS[r.result].name} berhasil! ✨ +15 XP`);
};

handler.help = ['craft', 'recipes'];
handler.tags = ['rpg'];
handler.command = /^(craft|recipes)$/i;
handler.register = true;

export default handler;
