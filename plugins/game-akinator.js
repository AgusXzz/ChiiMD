//ig@elyas_tzy
//furqan x elyas
//kira kira seperti itu wm nya jangan di hapus jangan di timpa jir
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { Akinator } = require('@aqul/akinator-api')
let handler = async (m, { conn }) => {
let id = m.chat
if (!conn.akinator) conn.akinator = new Map()
if (conn.akinator.has(id)) {
return m.reply('🎯 Game Akinator sudah berjalan di chat ini.\nTekan tombol *Nyerah* untuk berhenti.')
}
try {
const api = new Akinator({
region: 'id',
childMode: true
})
await api.start()
conn.akinator.set(id, api)
const progress = Math.round(api.progress)
await conn.sendButton(m.chat, {
image: { url: 'https://raw.githubusercontent.com/Furqan-si/file-random/main/CD1D1464333.jpeg' },
body: `🎩 *Akinator*\nPikirkan seseorang/karakter anime atau apapun dan aku akan menebaknya\n\n${api.question}\n\n📊 Progress : ${progress}%`,
footer: "Pilih jawaban:",
buttons: [
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Ya", id: "1" }) },
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Tidak", id: "2" }) },
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Tidak tahu", id: "3" }) },
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Mungkin", id: "4" }) },
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Mungkin tidak", id: "5" }) },
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🚪 Nyerah", id: "nyerah" }) }
]
}, { quoted: m }) 
} catch (e) { 
  console.error(e)
m.reply('❌ Gagal memulai Akinator.')
}

}

handler.before = async function (m) {

let id = m.chat

if (!this.akinator || !this.akinator.has(id)) return
if (!m.text) return

const session = this.akinator.get(id)
if (!session || session.processing) return

session.processing = true
const api = session

if (/nyerah/i.test(m.text)) {
this.akinator.delete(id)
session.processing = false
return m.reply('🚪 Game Akinator dihentikan.')
}

const answerMap = {
'1': 0,
'2': 1,
'3': 2,
'4': 3,
'5': 4,
'ya': 0,
'tidak': 1,
'tidak tahu': 2,
'mungkin': 3,
'mungkin tidak': 4
}

let answer = answerMap[m.text.toLowerCase().trim()]

if (answer === undefined) {
session.processing = false
return
}

try {

await api.answer(answer)

if (api.isWin) {

let caption = `🎉 *Akinator berhasil menebak!*\n\n`
caption += `👤 *${api.sugestion_name}*\n`

if (api.sugestion_desc) caption += `${api.sugestion_desc}\n`

await this.sendButton(m.chat, {
image: { url: api.sugestion_photo },
body: caption,
footer: "Game selesai",
buttons: [
{
name: "quick_reply",
buttonParamsJson: JSON.stringify({
display_text: "Main Lagi",
id: ".akinator"
})
}
]
}, { quoted: m })

this.akinator.delete(id)

} else {

const progress = Math.round(api.progress)

await this.sendButton(m.chat, {
body: `🎩 *Akinator*\n\n${api.question}\n\n📊 Progress : ${progress}%`,
footer: "Pilih jawaban:",
buttons: [
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Ya", id: "1" }) },
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Tidak", id: "2" }) },
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Tidak tahu", id: "3" }) },
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Mungkin", id: "4" }) },
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Mungkin tidak", id: "5" }) },
{ name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🚪 Nyerah", id: "nyerah" }) }
]
}, { quoted: m })

}

} catch (e) {

console.error(e)
m.reply('❌ Terjadi error. Game dihentikan.')
this.akinator.delete(id)

}

session.processing = false

}

handler.help = ['akinator','aki']
handler.tags = ['game']
handler.command = /^(akinator|aki)$/i
handler.limit = true

export default handler
