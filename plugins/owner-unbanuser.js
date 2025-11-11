let handler = async (m, { conn, text }) => {
	if (!text) throw 'Who wants to be banned?'
	let who
	if (m.isGroup) who = m.mentionedJid[0]
	else who = m.chat
	if (!who) throw 'Tag??'
	let users = (global.db.data.users[who].banned = false)
	m.reply('Success!')
}
handler.help = ['unban']
handler.tags = ['owner']
handler.command = /^unban(user)?$/i
handler.owner = true

export default handler
