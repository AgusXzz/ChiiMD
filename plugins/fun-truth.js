import axios from 'axios'
let handler = async (m, { conn, usedPrefix }) => {
	let result = await axios.get('https://raw.githubusercontent.com/BochilTeam/database/master/kata-kata/truth.json')
	let truth = result.data.getRandom()
	m.reply(truth)
}

handler.help = ['truth']
handler.tags = ['fun']
handler.command = /^(truth)$/i

export default handler
