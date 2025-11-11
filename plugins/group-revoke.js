let handler = async (m) => {
	m.reply('Berhasil Reset linkgc\n\nLink : https://chat.whatsapp.com/' + (await conn.groupRevokeInvite(m.chat)))
}
handler.help = ['revoke']
handler.tags = ['group']
handler.command = /^(revoke)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
