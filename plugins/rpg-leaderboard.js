import { guildLevel, fmt, sendBtn, BTN } from '../lib/rpg.js';

let handler = async function (m, { args }) {
	const mode = (args[0] || 'level').toLowerCase();
	if (mode === 'guild') {
		const gs = Object.values(global.db.data.guilds).sort((a, b) => (b.exp || 0) - (a.exp || 0));
		return sendBtn(
			this,
			m,
			'*🏰 GUILD TOP*\n\n' +
				(gs
					.slice(0, 10)
					.map((g, i) => `${i + 1}. ${g.name} — Lv.${guildLevel(g)} (${(g.members || []).length} member)`)
					.join('\n') || 'Belum ada guild.'),
			LB_BTNS
		);
	}
	const users = Object.values(global.db.data.users);
	let list;
	if (mode === 'money') list = users.sort((a, b) => (b.money || 0) - (a.money || 0));
	else if (mode === 'kills') list = users.sort((a, b) => (b.kills || 0) - (a.kills || 0));
	else list = users.sort((a, b) => (b.level || 0) - (a.level || 0) || (b.exp || 0) - (a.exp || 0));
	const rows = list
		.slice(0, 10)
		.map((u, i) => `${i + 1}. ${u.name || '???'} — Lv.${u.level}${mode === 'money' ? ' 💹 ' + fmt(u.money) : mode === 'kills' ? ' 🗡️ ' + (u.kills || 0) : ''}`)
		.join('\n');
	return sendBtn(this, m, `*LEADERBOARD ${mode.toUpperCase()}*\n\n${rows}`, LB_BTNS);
};

const LB_BTNS = [BTN('📊 Level', '.top'), BTN('💹 Money', '.top money'), BTN('🗡️ Kills', '.top kills'), BTN('🏰 Guild', '.top guild')];

handler.help = ['top'];
handler.tags = ['rpg'];
handler.command = /^(top|leaderboard)$/i;
handler.register = true;

export default handler;
