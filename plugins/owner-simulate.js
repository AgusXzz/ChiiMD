let handler = async (m, { conn, usedPrefix, command, args: [event], text }) => {
	if (!event)
		return await conn.reply(
			m.chat,
			`contoh:
${usedPrefix + command} welcome @user
${usedPrefix + command} bye @user
${usedPrefix + command} promote @user
${usedPrefix + command} demote @user`.trim(),
			m
		)
	let part = m.mentionedJid[0] || m.sender
	let act = false
	m.reply(`*Simulating ${event}...*`)
	switch (event.toLowerCase()) {
		case 'add':
		case 'invite':
		case 'welcome':
			act = 'add'
			break
		case 'bye':
		case 'kick':
		case 'leave':
		case 'remove':
			act = 'remove'
			break
		case 'promote':
			act = 'promote'
			break
		case 'demote':
			act = 'demote'
			break
		default:
			throw eror
	}
	if (act)
		return conn.participantsUpdate({
			id: m.chat,
			participants: [{ id: part }],
			action: act,
			simulate: true,
		})
}
handler.help = ['simulate']
handler.tags = ['owner']
handler.owner = true

handler.command = /^(simulate|simulasi)$/i
export default handler
