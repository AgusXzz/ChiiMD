import { DAILY_GOALS, WEEKLY_GOALS, addItem, fmt, sendBtn, BTN, getWeek } from '../lib/rpg.js';

const handler = async function (m, { command }) {
	const user = global.db.data.users[m.sender];
	const d = user.quest.daily || {};
	const w = user.quest.weekly || {};

	if (command === 'quest') {
		const dstr = Object.keys(DAILY_GOALS)
			.map((k) => `• ${k}: ${d[k] || 0}/${DAILY_GOALS[k]}`)
			.join('\n');
		const wstr = Object.keys(WEEKLY_GOALS)
			.map((k) => `• ${k}: ${w[k] || 0}/${WEEKLY_GOALS[k]}`)
			.join('\n');
		return sendBtn(this, m, `*QUEST*\n\n*Harian* (klaim: .daily)\n${dstr}\n\n*Mingguan* (klaim: .weekly)\n${wstr}`, [BTN('🎁 Klaim Harian', '.daily'), BTN('🎁 Klaim Mingguan', '.weekly')]);
	}

	if (command === 'daily') {
		if (d.date === new Date().toDateString()) return m.reply('Sudah klaim hari ini.');
		const ok = Object.keys(DAILY_GOALS).every((k) => (d[k] || 0) >= DAILY_GOALS[k]);
		if (!ok) return m.reply('Quest harian belum selesai.');
		user.quest.daily = { date: new Date().toDateString() };
		user.money += 500;
		user.limit += 5;
		addItem(user, 'crate_common', 2);
		addItem(user, 'potion', 3);
		return m.reply(`🎁 *Daily reward!*\n💹 +${fmt(500)}\n🎫 +5 limit\nCrate Common x2\nPotion x3`);
	}

	if (command === 'weekly') {
		const week = (user.quest.weekly || {}).week;
		if (week === getWeek(new Date())) return m.reply('Sudah klaim minggu ini.');
		const ok = Object.keys(WEEKLY_GOALS).every((k) => (w[k] || 0) >= WEEKLY_GOALS[k]);
		if (!ok) return m.reply('Quest mingguan belum selesai.');
		user.quest.weekly = { week: getWeek(new Date()) };
		user.money += 5000;
		user.limit += 20;
		addItem(user, 'crate_mythic', 1);
		addItem(user, 'gold', 10);
		return m.reply(`🎁 *Weekly reward!*\n💹 +${fmt(5000)}\n🎫 +20 limit\nCrate Mythic x1\nGold x10`);
	}
};

handler.help = ['quest', 'daily', 'weekly'];
handler.tags = ['rpg'];
handler.command = /^(quest|daily|weekly)$/i;
handler.register = true;

export default handler;
