let handler = async (m) => {
	global.db.data.chats[m.chat].isBanned = true;
	m.reply('Done!');
};
handler.help = ['banchat'];
handler.tags = ['owner'];
handler.command = /^(banchat|bnc)$/i;
handler.owner = true;
handler.group = true;
export default handler;
