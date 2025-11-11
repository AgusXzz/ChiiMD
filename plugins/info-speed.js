import os from 'os'
import fs from 'fs'

let handler = async (m, { conn }) => {
	let start = Date.now()

	await m.react('🍌')

	let cap = `\`Server Information\`
* Running On : ${process.env.username === 'root' ? 'VPS' : 'HOSTING ( PANEL )'}
* Home Dir : ${os.homedir()}
* Tmp Dir : ${os.tmpdir()} *( ${fs.readdirSync(os.tmpdir()).length} Files )*
* Hostname : ${os.hostname()}
* Node Version : ${process.version}
* Cwd : ${process.cwd()}

\`Management Server\`
* Bot Speed : ${Date.now() - start} ms
* Uptime : ${toTime(process.uptime() * 1000)}
* Total Memory : ${formatSize(os.freemem())}/${formatSize(os.totalmem())}
* CPU : ${os.cpus()[0].model} ( ${os.cpus().length} CORE )
* Release : ${os.release()}
* Type : ${os.type()}`

	m.reply(cap)
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping', 'speed', 'os']

export default handler

function toTime(ms) {
	let h = Math.floor(ms / 3600000)
	let m = Math.floor(ms / 60000) % 60
	let s = Math.floor(ms / 1000) % 60
	return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':')
}

function formatSize(size) {
	function round(value, precision) {
		var multiplier = Math.pow(10, precision || 0)
		return Math.round(value * multiplier) / multiplier
	}
	var KB = 1024
	var MB = KB * 1024
	var GB = MB * 1024
	var TB = GB * 1024
	if (size < KB) return size + 'B'
	if (size < MB) return round(size / KB, 1) + 'KB'
	if (size < GB) return round(size / MB, 1) + 'MB'
	if (size < TB) return round(size / GB, 1) + 'GB'
	return round(size / TB, 1) + 'TB'
}
