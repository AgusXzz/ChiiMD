import axios from 'axios'
import fs from 'fs'
let handler = async (m, { conn, text, isLimit }) => {
function pickRandom(list) {
	return list[Math.floor(list.length * Math.random())]
}
const sego = JSON.parse(
  fs.readFileSync(
    new URL('../lib/citacita.json', import.meta.url),
    'utf-8'
  )
)
			  let cita2 = pickRandom(sego)
			  let elyastzy = cita2.result
				await conn.sendFile(m.chat, elyastzy, 'tts.opus', '', m, true, { mimetype: 'audio/ogg; codecs=opus' }
)
}

handler.help = ['citacita']
handler.tags = ['fun']
handler.command = /^citacita$/i
handler.limit = false

export default handler
