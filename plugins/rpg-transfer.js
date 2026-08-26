import { fmt } from '../lib/rpg.js';

const handler = async (m, { text }) => {
	const user = global.db.data.users[m.sender];
	const target = m.quoted ? m.quoted.sender : m.mentionedJid[0];
	if (!target) return m.reply('Tag penerima: .transfer @user <money>');
	if (!global.db.data.users[target]) return m.reply('Penerima belum terdaftar.');
	const n = parseInt(text) || 0;
	if (n <= 0) return m.reply('Jumlah tidak valid.');
	if (user.money < n) return m.reply('Money tidak cukup.');
	user.money -= n;
	global.db.data.users[target].money += n;
	return m.reply(`💸 Transfer 💹 ${fmt(n)} ke @${target.split('@')[0]}.`);
};

handler.help = ['transfer'];
handler.tags = ['rpg'];
handler.command = /^(transfer)$/i;
handler.register = true;

export default handler;
