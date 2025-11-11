let handler = async (m, { usedPrefix, command, text }) => {
	if (!text) throw `Teksnya mana?\n\nContoh:\n${usedPrefix + command} Hi @user\n\n@user = User Tag\n@subject = Nama Group\n@desc = Deskripsi Group`
	let chat = global.db.data.chats[m.chat]

	switch (command) {
		case 'setwelcome':
			chat.sWelcome = text
			m.reply('✅ Pesan welcome berhasil diset:\n' + text)
			break
		case 'setbye':
			chat.sBye = text
			m.reply('✅ Pesan bye berhasil diset:\n' + text)
			break
		case 'setpromote':
			chat.sPromote = text
			m.reply('✅ Pesan promote berhasil diset:\n' + text)
			break
		case 'setdemote':
			chat.sDemote = text
			m.reply('✅ Pesan demote berhasil diset:\n' + text)
			break
	}
}

handler.help = ['welcome', 'bye', 'promote', 'demote'].map((v) => 'set' + v + ' <teks>')
handler.tags = ['group']
handler.command = /^(setwelcome|setbye|setpromote|setdemote)$/i
handler.group = true
handler.admin = true

export default handler
