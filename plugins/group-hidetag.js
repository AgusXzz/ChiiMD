let handler = async (m, { conn, text, participants }) => {
	const fkontak = {
		key: {
			participants: '0@s.whatsapp.net',
			remoteJid: 'status@broadcast',
			fromMe: false,
			id: 'Halo',
		},
		message: {
			contactMessage: {
				vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
			},
		},
		participant: '0@s.whatsapp.net',
	}
	conn.reply(m.chat, text, m, { mentions: participants.map((a) => a.id) })
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag)$/i
handler.group = true
handler.admin = true

export default handler
