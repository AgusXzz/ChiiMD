let handler = async (m, { conn, isAdmin, isBotAdmin, usedPrefix, command }) => {
	if (!m.quoted) return m.reply(`Reply pesan yang ingin dihapus dengan caption ${usedPrefix + command}`)
	if (m.quoted.fromMe) {
		await m.quoted.delete()
	} else {
		if (!isBotAdmin) return global.dfail('botAdmin', m, conn)
		if (!isAdmin) return global.dfail('admin', m, conn)
		let bilek = m.message.extendedTextMessage.contextInfo.participant
		let banh = m.message.extendedTextMessage.contextInfo.stanzaId
		await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: banh, participant: bilek } })
	}
}

handler.help = ['del']
handler.tags = ['tools']
handler.command = /^(del|delete|hapus?)$/i
handler.limit = false

export default handler
