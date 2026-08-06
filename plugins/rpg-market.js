import { ITEMS, hasItem, addItem, removeItem, isPremium, expireMarket, fmt } from '../lib/rpg.js';

let handler = async (m, { args }) => {
	const user = global.db.data.users[m.sender];
	const market = global.db.data.market;
	const sub = (args[0] || '').toLowerCase();

	if (!sub || sub === 'list') {
		expireMarket();
		const list = Object.entries(market)
			.slice(0, 20)
			.map(([id, l]) => `${id} — ${ITEMS[l.item]?.emoji} ${ITEMS[l.item]?.name} x${l.qty} 💹 ${fmt(l.price)}${l.seller === m.sender ? ' *(milikmu)*' : ''}`)
			.join('\n');
		return m.reply(`*MARKET*\n\n${list || 'Kosong.'}\n\nJual: .market sell <item> <qty> <harga>\nBeli: .market buy <id>\nBatal: .market cancel <id>`);
	}

	if (sub === 'sell') {
		const id = (args[1] || '').toLowerCase();
		const n = parseInt(args[2]) || 1;
		const p = parseInt(args[3]) || 0;
		const item = ITEMS[id];
		if (!item || item.crate || item.pet || item.story || ['event', 'boss'].includes(item.source)) return m.reply('Item tidak valid untuk dijual.');
		if (n <= 0 || p <= 0) return m.reply('Format: .market sell <item> <qty> <harga>');
		if (!hasItem(user, id, n)) return m.reply('Item tidak cukup.');
		const fee = isPremium(user) ? 0 : 100;
		if (user.money < fee) return m.reply(`Butuh 💹 ${fee} untuk biaya listing.`);
		removeItem(user, id, n);
		user.money -= fee;
		const lid = 'm' + Date.now() + Math.floor(Math.random() * 100);
		market[lid] = { item: id, qty: n, price: p, seller: m.sender, at: Date.now() };
		return m.reply(`📦 Listing ${item.emoji} ${item.name} x${n} seharga 💹 ${fmt(p)}.\nID: *${lid}*`);
	}

	if (sub === 'buy') {
		const lid = args[1];
		const l = market[lid];
		if (!l) return m.reply('Listing tidak ditemukan.');
		if (l.seller === m.sender) return m.reply('Tidak bisa membeli listing sendiri.');
		const cost = l.price * l.qty;
		if (user.money < cost) return m.reply(`Butuh 💹 ${fmt(cost)}.`);
		user.money -= cost;
		addItem(user, l.item, l.qty);
		const seller = global.db.data.users[l.seller];
		seller.money += Math.floor(l.price * l.qty * 0.95);
		delete market[lid];
		return m.reply(`✅ Membeli ${ITEMS[l.item].emoji} ${ITEMS[l.item].name} x${l.qty}.`);
	}

	if (sub === 'cancel') {
		const lid = args[1];
		const l = market[lid];
		if (!l || l.seller !== m.sender) return m.reply('Listing tidak ditemukan.');
		addItem(user, l.item, l.qty);
		delete market[lid];
		return m.reply('Listing dibatalkan, item dikembalikan.');
	}

	return m.reply('Sub-perintah: list/sell/buy/cancel');
};

handler.help = ['market'];
handler.tags = ['rpg'];
handler.command = ['market'];
handler.register = true;

export default handler;
