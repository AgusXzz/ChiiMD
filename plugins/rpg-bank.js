import { fmt, sendBtn, BTN } from '../lib/rpg.js';

let handler = async function (m, { command, text }) {
	const user = global.db.data.users[m.sender];
	const n = parseInt(text) || 0;
	if (command === 'bank') {
		return sendBtn(this, m, `🏦 *BANK*\n\nMoney: 💹 ${fmt(user.money)}\nBank: 🏦 ${fmt(user.bank)}\n\nDeposit: .deposit <jumlah>\nWithdraw: .withdraw <jumlah>`, [
			BTN('💳 Deposit 10k', '.deposit 10000'),
			BTN('💳 Deposit 100k', '.deposit 100000'),
			BTN('🏧 Withdraw 10k', '.withdraw 10000'),
			BTN('🏧 Withdraw 100k', '.withdraw 100000'),
		]);
	}
	if (command === 'deposit') {
		if (n <= 0 || user.money < n) return m.reply('Jumlah tidak valid.');
		user.money -= n;
		user.bank += n;
		return m.reply(`💳 Deposito 💹 ${fmt(n)}. Bank: ${fmt(user.bank)}`);
	}
	if (command === 'withdraw') {
		if (n <= 0 || user.bank < n) return m.reply('Jumlah tidak valid.');
		user.bank -= n;
		user.money += n;
		return m.reply(`💳 Tarik 💹 ${fmt(n)}. Bank: ${fmt(user.bank)}`);
	}
};

handler.help = ['bank', 'deposit', 'withdraw'];
handler.tags = ['rpg'];
handler.command = /^(bank|deposit|withdraw)$/i;
handler.register = true;

export default handler;
