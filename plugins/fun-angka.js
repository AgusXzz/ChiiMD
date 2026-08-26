const handler = async (m, { conn, args }) => {
	const angkaUser = args[0];
	const angkaValid = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

	if (!angkaUser || !angkaValid.includes(angkaUser)) return conn.reply(m.chat, '⚠️ Masukkan angka antara 0 sampai 9!\nContoh: #angka 5', m);

	const angkaBot = pickRandom(angkaValid);
	const tebakanBenar = angkaUser === angkaBot;
	const bonus = tebakanBenar ? Math.floor(Math.random() * 201) + 100 : Math.floor(Math.random() * 100) + 1;

	global.db.data.users[m.sender].exp += bonus;

	const hasil = `
*「 🎲 TEBAK ANGKA 」*

🎯 Angka Kamu : *${angkaUser}*
🤖 Angka Bot  : *${angkaBot}*

${tebakanBenar ? '✅ Tebakanmu **BENAR!**' : '❌ Tebakanmu **SALAH!**'}
🎁 Kamu mendapatkan *+${bonus} XP!*
`.trim();

	conn.reply(m.chat, hasil, m);
};

handler.help = ['angka'];
handler.tags = ['fun'];
handler.command = /^angka$/i;

export default handler;

function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)];
}
