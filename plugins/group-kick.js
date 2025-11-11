let handler = async (m, { args, text, participants }) => {
	let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : ''
	if (!who) return m.reply('Reply/Tag/Tulis nomor yang ingin dikick')
	if (!who || who == m.sender) throw 'Reply / tag yang ingin di kick'
	if (participants.filter((v) => v.jid == who || v.id === who || v.phoneNumber === who).length == 0) throw `Target tidak berada dalam Grup !`
	conn.groupParticipantsUpdate(m.chat, [who], 'remove').then((_) => m.reply(`Success`))
}
handler.help = ['kick']
handler.tags = ['group']
handler.command = /^(kick|dor)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
