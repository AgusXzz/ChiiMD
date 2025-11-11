import * as cheerio from 'cheerio'

let handler = async (m, { conn, text }) => {
	if (text.match(/(https:\/\/sfile.mobi\/)/gi)) {
		let res = await download(text)
		if (!res) throw 'Tidak Dapat Mengunduh File'
		await m.reply(
			Object.keys(res)
				.map((v) => `*• ${v.capitalize()}:* ${res[v]}`)
				.join('\n') + '\n\n_Sending file..._'
		)
		const buff = Buffer.from(await (await fetch(res.download)).arrayBuffer())
		conn.sendMessage(m.chat, { document: buff, fileName: res.filename, mimetype: res.mimetype }, { quoted: m })
	} else if (text) {
		let [query, page] = text.split`|`
		let res = await search(query, page)
		if (!res.length) throw `Query "${text}" not found :/`
		res = res.map((v) => `*Title:* ${v.title}\n*Size:* ${v.size}\n*Link:* ${v.link}`).join`\n\n`
		m.reply(res)
	} else return m.reply('Input Query / Sfile Url!')
}
handler.help = ['sfile']
handler.tags = ['downloader']
handler.command = /^(sfile)$/i
handler.limit = true
export default handler

async function search(query, page = 1) {
	const res = await fetch(`https://sfile.mobi/search.php?q=${query}&page=${page}`)
	const $ = cheerio.load(await res.text())
	const result = []
	$('div.list').each(function () {
		const title = $(this).find('a').text()
		const size = $(this).text().trim().split('(')[1]
		const link = $(this).find('a').attr('href')
		if (link) result.push({ title, size: size.replace(')', ''), link })
	})

	return result
}

async function download(url) {
	const res = await fetch(url)
	let $ = cheerio.load(await res.text())
	const filename = $('img.intro').attr('alt')
	const mimetype = $('div.list').text().split(' - ')[1].split('\n')[0]
	const dl = $('#download').attr('href')
	const up_at = $('.list').eq(2).text().split(':')[1].trim()
	const uploader = $('.list').eq(1).find('a').eq(0).text().trim()
	const total_down = $('.list').eq(3).text().split(':')[1].trim()

	const data = await fetch(dl)
	$ = cheerio.load(await data.text())
	const scripts = $('script')
		.map((i, el) => $(el).html())
		.get()
		.join('\n')
	const finalUrlRegex = /https:\\\/\\\/download\d+\.sfile\.mobi\\\/downloadfile\\\/\d+\\\/\d+\\\/[a-z0-9]+\\\/[^\s'"]+\.[a-z0-9]+(\?[^"']+)?/gi
	const matches = scripts.match(finalUrlRegex)
	const download = matches[0].replace(/\\\//g, '/')

	return {
		filename,
		mimetype,
		upload_date: up_at,
		uploader,
		total_download: total_down,
		download,
	}
}
