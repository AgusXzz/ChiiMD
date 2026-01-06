let handler = async (m) => {
	if (new Date() - global.db.data.users[m.sender].lastnguli > 86400000) {
		global.db.data.users[m.sender].limit += 10;
		m.reply('_Selamat Kamu Mendapatkan +10 Limit_');
		global.db.data.users[m.sender].lastnguli = Date.now();
	} else m.reply('Kamu Sudah Mengklaim Upah Nguli Hari Ini');
};
handler.help = ['nguli'];
handler.tags = ['rpg'];
handler.command = /^(nguli)$/i;
handler.group = true;

export default handler;
