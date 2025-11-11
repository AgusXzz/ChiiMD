let handler = async (m) => {
	m.reply('https://chat.whatsapp.com/' + (await conn.groupInviteCode(m.chat)))
}
handler.help = ['linkgc']
handler.tags = ['group']
handler.command = /^(linkgc)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
