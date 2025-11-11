import axios from 'axios'
import * as cheerio from 'cheerio'
import FormData from 'form-data'

let handler = async (m, { usedPrefix, command }) => {
	let quoted = m.quoted ? m.quoted : m
	let mime = (quoted.msg || quoted).mimetype
	if (!/image/.test(mime)) return m.reply(`Kirim/Reply Foto Dengan Caption ${usedPrefix + command}`)
	let media = await quoted.download()
	let res
	if (/^hdr$/i.test(command)) {
		res = await hdr(media, 4)
	} else {
		res = await hdr(media, 2)
	}
	conn.sendFile(m.chat, res, 'hd.png', 'Nih Hasilnya', m)
}
handler.help = ['hd']
handler.tags = ['tools']
handler.command = /^(hd|hdr)$/i
handler.limit = true
export default handler

async function getToken() {
	try {
		const html = await axios.get('https://www.iloveimg.com/upscale-image')
		const $ = cheerio.load(html.data)
		const script = $('script')
			.filter((i, el) => $(el).html().includes('ilovepdfConfig ='))
			.html()
		const jsonS = script.split('ilovepdfConfig = ')[1].split(';')[0]
		const json = JSON.parse(jsonS)
		const csrf = $('meta[name="csrf-token"]').attr('content')
		return {
			token: json.token,
			csrf,
		}
	} catch (err) {
		throw new Error('Error: ' + err.message)
	}
}

async function uploadImage(server, headers, buffer, task) {
	const form = new FormData()
	form.append('name', 'image.jpg')
	form.append('chunk', '0')
	form.append('chunks', '1')
	form.append('task', task)
	form.append('preview', '1')
	form.append('file', buffer, 'image.jpg')

	const res = await axios.post(`https://${server}.iloveimg.com/v1/upload`, form, {
		headers: {
			...headers,
			...form.getHeaders(),
		},
	})

	return res.data
}

async function hdr(buffer, scale = 4) {
	const { token, csrf } = await getToken()
	const servers = [
		'api1g',
		'api2g',
		'api3g',
		'api8g',
		'api9g',
		'api10g',
		'api11g',
		'api12g',
		'api13g',
		'api14g',
		'api15g',
		'api16g',
		'api17g',
		'api18g',
		'api19g',
		'api20g',
		'api21g',
		'api22g',
		'api24g',
		'api25g',
	]
	const server = servers[Math.floor(Math.random() * servers.length)]

	const task = 'r68zl88mq72xq94j2d5p66bn2z9lrbx20njsbw2qsAvgmzr11lvfhAx9kl87pp6yqgx7c8vg7sfbqnrr42qb16v0gj8jl5s0kq1kgp26mdyjjspd8c5A2wk8b4Adbm6vf5tpwbqlqdr8A9tfn7vbqvy28ylphlxdl379psxpd8r70nzs3sk1'
	const headers = {
		Authorization: 'Bearer ' + token,
		Origin: 'https://www.iloveimg.com/',
		Cookie: '_csrf=' + csrf,
		'User-Agent': 'Mozilla/5.0',
	}

	const upload = await uploadImage(server, headers, buffer, task)

	const form = new FormData()
	form.append('task', task)
	form.append('server_filename', upload.server_filename)
	form.append('scale', scale)

	const res = await axios.post(`https://${server}.iloveimg.com/v1/upscale`, form, {
		headers: {
			...headers,
			...form.getHeaders(),
		},
		responseType: 'arraybuffer',
	})

	return res.data
}
