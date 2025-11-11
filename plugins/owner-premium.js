let handler = async (m, { args, usedPrefix, command }) => {
	let who
	if (m.quoted) {
		who = m.quoted.sender
	} else if (m.isGroup) {
		who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[1] ? args[1] : false
	} else if (args[1]) {
		who = args[1] + '@s.whatsapp.net'
	}

	if (!who) throw `Siapa yang ingin diubah status premium-nya?`

	let user = db.data.users[who]

	switch (command) {
		case 'addprem':
		case 'tambahprem':
		case '+prem':
			if (!args[0]) throw `Mau berapa hari??`

			if (args[0] == 'permanen') {
				user.premium = true
				user.premiumTime = null
				await m.reply(`✅ *Success* \n\n*Nama:* ${user.name}\n*Status Premium:* Permanen\n*Tanggal:* ${new Date().toLocaleDateString()}`)
				await conn.reply(who, `✨ *Premium Info*\n\n*Nama:* ${user.name}\n*Status Premium:* Permanen\n*Tanggal:* ${new Date().toLocaleDateString()}`, null)
			} else {
				if (isNaN(args[0])) return m.reply(`⚠️ Hanya Nomor!\n\nContoh:\n${usedPrefix + command} 30 @${m.sender.split`@`[0]}`)
				let txt = args[0]
				let jumlahHari = 86400000 * txt

				let now = new Date()
				if (now < user.premiumTime) {
					user.premiumTime += jumlahHari
				} else {
					user.premiumTime = now.getTime() + jumlahHari
				}
				user.premium = true

				let tanggalBerakhir = new Date(user.premiumTime).toLocaleDateString()

				await m.reply(`✅ *Success* \n\n*Nama:* ${user.name}\n*Durasi:* ${txt} Hari\n*Mulai:* ${now.toLocaleDateString()}\n*Berakhir:* ${tanggalBerakhir}`)
				await conn.reply(who, `✨ *Premium Info*\n\n*Nama:* ${user.name}\n*Durasi:* ${txt} Hari\n*Mulai:* ${now.toLocaleDateString()}\n*Berakhir:* ${tanggalBerakhir}`, null)
			}
			break

		case 'delprem':
		case 'hapusprem':
		case '-prem':
			user.premium = false
			user.premiumTime = 0
			await m.reply(`⚠️ *Success* \n\n*Nama:* ${user.name}\nStatus premium dihapus pada ${new Date().toLocaleDateString()}.`)
			await conn.reply(who, `✨ *Premium Info*\n\n*Nama:* ${user.name}\nStatus premium dihapus pada ${new Date().toLocaleDateString()}.`, null)
			break

		default:
			throw `Command tidak valid. Gunakan addprem atau delprem.`
	}
}

handler.help = ['addprem', 'delprem']
handler.tags = ['owner']
handler.command = /^(add|tambah|\+|del|hapus|\-)p(rem)?$/i
handler.group = false
handler.owner = true

export default handler
