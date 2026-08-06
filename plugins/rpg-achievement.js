import { ACHIEVEMENTS, grantAchievements, fmt, itemLabel } from '../lib/rpg.js';

let handler = async (m) => {
	const user = global.db.data.users[m.sender];
	const newly = grantAchievements(user);
	const claimed = user.ach?.claimed || [];

	const list = ACHIEVEMENTS.map((a) => {
		const ok = claimed.includes(a.id);
		return `${ok ? '✅' : '⬜'} ${a.name} — ${a.desc}${ok ? '' : ` (${fmt(a.reward.money || 0)} money${a.reward.item ? `, ${itemLabel(a.reward.item)}` : ''})`}`;
	}).join('\n');

	const txt = [`*ACHIEVEMENTS* (${claimed.length}/${ACHIEVEMENTS.length})`, '', list].join('\n');
	if (newly.length) {
		return m.reply(`${txt}\n\n🎉 *Achievement baru:*\n${newly.map((a) => `• ${a.name} — 💹 +${fmt(a.reward.money || 0)}${a.reward.item ? `, ${itemLabel(a.reward.item)}` : ''}`).join('\n')}`);
	}
	return m.reply(txt);
};

handler.help = ['ach'];
handler.tags = ['rpg'];
handler.command = /^(ach|achievement(s)?)$/i;
handler.register = true;

export default handler;
