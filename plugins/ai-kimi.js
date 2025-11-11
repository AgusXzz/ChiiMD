import { deepinfra } from './ai-deepseek.js'

let handler = async (m, { text, usedPrefix, command }) => {
	const input = m.quoted ? m.quoted.text : text
	if (!input) return m.reply(`Masukkan pertanyaan atau perintah!\n\nContoh:\n${usedPrefix + command} apa itu AI`)

	if (!conn.kimi) conn.kimi = {}
	if (!conn.kimi[m.sender]) conn.kimi[m.sender] = []
	conn.kimi[m.sender].push({ role: 'user', content: input })

	try {
		const res = await deepinfra('moonshotai/Kimi-K2-Instruct-0905', conn.kimi[m.sender])
		conn.kimi[m.sender].push({ role: 'assistant', content: res })
		m.reply(res)
	} catch (err) {
		m.reply('Terjadi Kesalahan')
		console.error(err)
	}
}

handler.help = ['kimi']
handler.tags = ['ai']
handler.command = /^kimi$/i
handler.register = true
handler.limit = true

export default handler
