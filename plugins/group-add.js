let handler = async (m, { args, text, groupMetadata }) => {
	const user = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : ''
	if (!user) return m.reply('Reply/Tag/Tulis nomor yang ingin diadd')
	const response = await conn.groupParticipantsUpdate(m.chat, [user], 'add')
	const jpegThumbnail = await conn.profilePictureUrl(m.chat, 'image')

	for (const participant of response) {
		const jid = participant.content.attrs.phone_number || participant.content.attrs.jid
		const status = participant.status

		if (status === '408') {
			m.reply(`Tidak dapat menambahkan @${jid.split('@')[0]}!\nMungkin @${jid.split('@')[0]} baru keluar dari grup ini atau dikick`)
		} else if (status === '403') {
			const inviteCode = participant.content.content[0].attrs.code
			const inviteExp = participant.content.content[0].attrs.expiration
			await m.reply(`Mengundang @${jid.split('@')[0]} menggunakan invite...`)

			await conn.sendGroupV4Invite(m.chat, jid, inviteCode, inviteExp, groupMetadata.subject, 'Undangan untuk bergabung ke grup WhatsApp saya', jpegThumbnail)
		}
	}
}
handler.help = ['add']
handler.tags = ['group']
handler.command = /^(add)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
