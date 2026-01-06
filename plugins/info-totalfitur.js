let handler = async (m) => {
	let total = Object.values(global.plugins).filter((v) => v.help && v.tags).length;
	conn.adReply(m.chat, `Total Fitur Bot Saat ini: ${total}`, './media/thumbnail.jpg', m, { title: 'Total Cintaku Padamu' });
};

handler.help = ['totalfitur'];
handler.tags = ['info'];
handler.command = ['totalfitur'];
export default handler;
