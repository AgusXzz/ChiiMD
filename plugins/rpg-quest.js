import { DAILY_GOALS, WEEKLY_GOALS, addItem, fmt, sendBtn, BTN } from '../lib/rpg.js';

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
		if (week === getWeekNow()) return m.reply('Sudah klaim minggu ini.');
		const ok = Object.keys(WEEKLY_GOALS).every((k) => (w[k] || 0) >= WEEKLY_GOALS[k]);
		if (!ok) return m.reply('Quest mingguan belum selesai.');
		user.quest.weekly = { week: getWeekNow() };
		user.money += 5000;
		user.limit += 20;
		addItem(user, 'crate_mythic', 1);
		addItem(user, 'gold', 10);
		return m.reply(`🎁 *Weekly reward!*\n💹 +${fmt(5000)}\n🎫 +20 limit\nCrate Mythic x1\nGold x10`);
	}
};

function getWeekNow() {
	const d = new Date();
	d.setHours(0, 0, 0, 0);
	d.setDate(d.getDate() + 4 - (d.getDay() || 7));
	const yearStart = new Date(d.getFullYear(), 0, 1);
	return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

handler.help = ['quest', 'daily', 'weekly'];
handler.tags = ['rpg'];
handler.command = /^(quest|daily|weekly)$/i;
handler.register = true;

export default handler;
