import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
	const input = m.quoted ? m.quoted.text : text
	if (!input) return m.reply(`Masukkan pertanyaan atau perintah!\n\nContoh:\n${usedPrefix + command} apa itu AI`)

	if (!conn.deepseek) conn.deepseek = {}
	if (!conn.deepseek[m.sender]) conn.deepseek[m.sender] = []
	conn.deepseek[m.sender].push({ role: 'user', content: input })

	try {
		const res = await deepinfra('deepseek-ai/DeepSeek-V3.1', conn.deepseek[m.sender])
		conn.deepseek[m.sender].push({ role: 'assistant', content: res })
		m.reply(res)
	} catch (err) {
		m.reply('Terjadi Kesalahan')
		console.error(err)
	}
}

handler.help = ['deepseek']
handler.tags = ['ai']
handler.command = /^deepseek|depseek|deepsek|dipsek$/i
handler.register = true
handler.limit = true

export default handler

export async function deepinfra(model, history) {
	try {
		const res = await axios.post(
			'https://api.deepinfra.com/v1/openai/chat/completions',
			{
				model,
				messages: history,
			},
			{
				headers: {
					'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
					'Content-Type': 'application/json',
				},
			}
		)

		let teks = []
		for (let out of res.data.choices || []) {
			if (out.message?.content) teks.push(out.message.content)
		}
		return teks.join('\n')
	} catch (e) {
		return e?.response?.data || e?.message
	}
}
