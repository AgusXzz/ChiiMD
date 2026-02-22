let handler = async (m, { text, conn }) => {
	if (!text) throw 'Masukkan text\n\nContoh:\n.brat abay dan senn';
	try {
		const url = 'https://shinana-brat.hf.space/?text=' + encodeURIComponent(text);
		conn.sendSticker(m.chat, url, m);
	} catch (e) {
		console.error(e);
		m.reply('Brat error, donasi ke owner segera');
	}
};

handler.help = ['brat'];
handler.tags = ['sticker'];
handler.command = /^brat$/i;
handler.register = true;

export default handler;
