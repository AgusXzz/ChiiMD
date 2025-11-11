import { createHash } from 'crypto'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { text, usedPrefix, command }) {
	let user = global.db.data.users[m.sender]
	const pp = await conn.profilePictureUrl(m.sender)
	if (user.registered === true) throw `You Have Already Registered In The Database, Do You Want To Re-Register? *${usedPrefix}unreg*`
	if (!Reg.test(text)) return m.reply(`Masukan Nama.Umur kamu\nContoh: .daftar Tio.17`)
	let [_, name, splitter, age] = text.match(Reg)
	if (!name) throw 'Nama Tidak Boleh Kosong'
	if (!age) throw 'Umur Tidak Boleh Kosong'
	age = parseInt(age)
	if (age > 50) throw 'Tua Banget amjir'
	if (age < 12) throw 'Esempe Dilarang masuk'
	user.name = name.trim()
	user.age = age
	user.regTime = Date.now()
	user.registered = true
	let sn = createHash('md5').update(m.sender).digest('hex')
	let cap = `
╭━━「 *Information*
│• *Name:* ${name}
│• *Age:* ${age} Years
│• *Status:* _Success_
│• *Serial Number:* ${sn}
╰╾•••
`
	conn.sendMessage(
		m.chat,
		{
			text: cap,
			contextInfo: {
				externalAdReply: {
					title: 'Berhasil Registrasi',
					body: 'Kamu Adalah User Ke ' + Object.values(db.data.users).filter((v) => v.registered == true).length,
					thumbnail: pp,
					mediaType: 1,
					renderLargerThumbnail: true,
				},
			},
		},
		m
	)
}
handler.help = ['daftar <nama>.<umur>']
handler.tags = ['xp']
handler.command = /^(daftar|verify|reg(ister)?)$/i

export default handler
