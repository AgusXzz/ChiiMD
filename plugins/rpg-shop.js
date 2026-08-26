import { ITEMS, hasItem, addItem, removeItem, fmt, itemLabel, sendBtn, BTN } from '../lib/rpg.js';

const LIMIT_PRICE = 1000;
const SHOP_OK = (i) => i && !i.crate && !i.pet && !i.story && !i.source && i.price;
const EXCLUSIVE = (i) => i?.story || ['event', 'boss'].includes(i?.source);

let handler = async function (m, { command, text }) {
	const user = global.db.data.users[m.sender];

	if (command === 'shop') {
		const list = Object.entries(ITEMS)
			.filter(([, i]) => SHOP_OK(i))
			.map(([id, i]) => `${itemLabel(id)} — 💹 ${fmt(i.price)}`)
			.join('\n');
		return sendBtn(this, m, `*SHOP*\n\n${list}\n\nBeli: .buy <item> <qty>\nBeli Limit: .buy limit <qty> (💹 ${fmt(LIMIT_PRICE)}/limit)\nJual: .sell <item> <qty>`, [
			BTN('🎫 Beli Limit', '.buy limit 1'),
			BTN('🎫 Beli Limit x5', '.buy limit 5'),
		]);
	}

	const [id, qty = '1'] = (text || '').trim().toLowerCase().split(/\s+/);
	const item = ITEMS[id];
	const n = Math.max(1, parseInt(qty) || 1);

	if (command === 'buy') {
		if (!id) return m.reply('Tentukan item yang mau dibeli. Lihat daftar: .shop\nContoh: .buy potion');
		if (id === 'limit') {
			const cost = LIMIT_PRICE * n;
			if (user.money < cost) return m.reply(`Money tidak cukup. Butuh 💹 ${fmt(cost)}.`);
			user.money -= cost;
			user.limit += n;
			return m.reply(`✅ Membeli *${n} limit* — 💹 ${fmt(cost)}. Limit: ${user.limit}`);
		}
		if (!SHOP_OK(item)) return m.reply('Item tidak tersedia di shop.');
		const cost = item.price * n;
		if (user.money < cost) return m.reply(`Money tidak cukup. Butuh 💹 ${fmt(cost)}.`);
		user.money -= cost;
		addItem(user, id, n);
		return m.reply(`✅ Membeli ${item.emoji} ${item.name} x${n} — 💹 ${fmt(cost)}.`);
	}

	if (command === 'sell') {
		if (!item) return m.reply('Item tidak ditemukan.');
		if (item.pet) return m.reply('Pet tidak bisa dijual.');
		if (EXCLUSIVE(item)) return m.reply('Item eksklusif tidak bisa dijual.');
		if (!hasItem(user, id, n)) return m.reply('Jumlah item tidak cukup.');
		removeItem(user, id, n);
		const gain = Math.floor(item.price * 0.5) * n;
		user.money += gain;
		return m.reply(`💰 Menjual ${item.emoji} ${item.name} x${n} — 💹 +${fmt(gain)}.`);
	}
};

handler.help = ['shop', 'buy', 'sell'];
handler.tags = ['rpg'];
handler.command = /^(shop|buy|beli|sell|jual)$/i;
handler.register = true;

export default handler;
