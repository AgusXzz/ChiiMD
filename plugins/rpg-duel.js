import * as gameState from '../lib/state.js';
import { BTN, sendBtn, getStats, duelText, duelBtns, fmt } from '../lib/rpg.js';

const handler = async function (m, { command, args }) {
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
		gameState.set('duelChal', m.chat, { a: m.sender, b: target, bet });
		return sendBtn(this, m, `⚔️ *DUEL CHALLENGE*\n\n@${target.split('@')[0]}, kamu ditantang @${m.sender.split('@')[0]}${bet ? ` dengan taruhan 💹 ${fmt(bet)}` : ''}!\n\nTerima tantangan?`, [
			BTN('✅ Terima', '.accept'),
			BTN('❌ Tolak', '.decline'),
		]);
	}

	const chal = gameState.get('duelChal', m.chat);
	if (!chal) return m.reply('Tidak ada tantangan duel aktif.');
	if (m.sender !== chal.b) return m.reply('Bukan kamu yang ditantang.');
	gameState.del('duelChal', m.chat);
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
	const stateObj = { a: chal.a, b: chal.b, turn: 'a', aDef: 0, bDef: 0, aCd: 0, bCd: 0, bet: chal.bet };
	gameState.set('duel', chal.a, stateObj);
	gameState.set('duel', chal.b, stateObj);
	return sendBtn(this, m, duelText(stateObj, aUser, bUser), duelBtns());
};

handler.help = ['duel'];
handler.tags = ['rpg'];
handler.command = /^(duel|accept|terima|decline|tolak)$/i;
handler.register = true;

export default handler;
