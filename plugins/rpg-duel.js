import { BTN, sendBtn, getStats, duelText, duelBtns, fmt } from '../lib/rpg.js';

let handler = async function (m, { command, args }) {
	const user = global.db.data.users[m.sender];
	if (command === 'duel') {
		if (!user.class) return m.reply('Pilih kelas dulu: .kelas');
		const target = m.quoted ? m.quoted.sender : m.mentionedJid[0];
		if (!target) return m.reply('Tag pemain yang mau ditantang: .duel @user [bet]');
		if (target === m.sender) return m.reply('Tidak bisa duel diri sendiri.');
		const tUser = global.db.data.users[target];
		if (!tUser?.class) return m.reply('Target belum memilih kelas.');
		const bet = parseInt(args[0]) || 0;
		if (bet < 0 || bet > user.money) return m.reply('Bet tidak valid atau melebihi money-mu.');
		this.duelChallenges = this.duelChallenges || new Map();
		this.duelChallenges.set(m.chat, { a: m.sender, b: target, bet });
		return sendBtn(this, m, `⚔️ *DUEL CHALLENGE*\n\n@${target.split('@')[0]}, kamu ditantang @${m.sender.split('@')[0]}${bet ? ` dengan taruhan 💹 ${fmt(bet)}` : ''}!\n\nTerima tantangan?`, [
			BTN('✅ Terima', '.accept'),
			BTN('❌ Tolak', '.decline'),
		]);
	}

	const chal = (this.duelChallenges || new Map()).get(m.chat);
	if (!chal) return m.reply('Tidak ada tantangan duel aktif.');
	if (m.sender !== chal.b) return m.reply('Bukan kamu yang ditantang.');
	this.duelChallenges.delete(m.chat);
	if (command === 'decline') return m.reply('❌ Tantangan ditolak.');

	const aUser = global.db.data.users[chal.a];
	const bUser = global.db.data.users[chal.b];
	if (chal.bet > aUser.money || chal.bet > bUser.money) return m.reply('Salah satu tidak punya cukup money untuk bet.');
	aUser.money -= chal.bet;
	bUser.money -= chal.bet;
	const sA = getStats(aUser);
	const sB = getStats(bUser);
	aUser.hp = sA.maxHp;
	aUser.mana = sA.maxMana;
	bUser.hp = sB.maxHp;
	bUser.mana = sB.maxMana;
	this.duels = this.duels || new Map();
	const state = { a: chal.a, b: chal.b, turn: 'a', aDef: 0, bDef: 0, aCd: 0, bCd: 0, bet: chal.bet };
	this.duels.set(chal.a, state);
	this.duels.set(chal.b, state);
	return sendBtn(this, m, duelText(state, aUser, bUser), duelBtns());
};

handler.help = ['duel'];
handler.tags = ['rpg'];
handler.command = /^(duel|accept|terima|decline|tolak)$/i;
handler.register = true;

export default handler;
