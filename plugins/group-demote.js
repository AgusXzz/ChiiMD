let handler = async (m, { args, text, participants }) => {
	const user = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : ''
	if (!user) return m.reply('Reply / tag yang ingin di demote')
	if (participants.filter((v) => v.jid == user || v.id === user || v.phoneNumber === user).length == 0) return m.reply('Target tidak berada dalam Grup !')
	conn.groupParticipantsUpdate(m.chat, [user], 'demote').then((_) => m.reply('Berhasil'))
}
handler.help = ['demote']
handler.tags = ['group']
handler.command = /^(demote|unadmin)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
