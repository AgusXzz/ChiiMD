const handler = async (m, { conn, text }) => {
	if (!text) throw 'Contoh:\n.bratvid elyas ganteng banget follow elyas_tzy';
	try {
		await m.reply('⏳ Membuat brat video...');
		const url = `https://skyzxu-brat.hf.space/brat-animated?text=${encodeURIComponent(text)}`;
		await conn.sendSticker(m.chat, url, m, {
			packname: stickpack,
			author: stickauth,
		});
	} catch (e) {
		console.error(e);
		return m.reply('❌ Gagal membuat bratvid.');
	}
};

handler.help = ['bratvid <text>'];
handler.tags = ['sticker'];
handler.command = /^bratvid$/i;
handler.limit = true;
export default handler;
