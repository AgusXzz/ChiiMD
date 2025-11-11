import fs from 'fs'
let handler = async (m, { text, usedPrefix, command }) => {
	if (!text) throw `uhm.. teksnya mana?\n\npenggunaan:\n${usedPrefix + command} <teks>\n\ncontoh:\n${usedPrefix + command} plugins/file.js`
	if (!m.quoted?.text) throw `balas pesan nya!`
	let path = `./plugins/${text}.js`
	await fs.writeFileSync(path, m.quoted.text)
	m.reply(`tersimpan di ${path}`)
}
handler.help = ['sfp <text>']
handler.tags = ['owner']
handler.command = /^sfp$/i
handler.owner = true
export default handler
