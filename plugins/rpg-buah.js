let handler = async (m, { usedPrefix }) => {
	let user = global.db.data.users[m.sender];
	let ini_txt = `[ *GUDANG BUAH KAMU* ]\n\n`;
	ini_txt += `${user.pisang} Pisang\n`;
	ini_txt += `${user.anggur} Anggur\n`;
	ini_txt += `${user.mangga} Mangga\n`;
	ini_txt += `${user.jeruk} Jeruk\n`;
	ini_txt += `${user.apel} Apel\n\n`;
	ini_txt += `Ketik *${usedPrefix}jual* Untuk Menjual.`;
	m.reply(ini_txt);
};

handler.help = ['listbuah'];
handler.tags = ['rpg'];
handler.command = /^((list)?(buah|fruits?))$/i;

export default handler;
