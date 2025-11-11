let handler = async (m, { command, text }) => {
	if (!text) return m.reply('Masukkan namamu!')

	m.reply(
		`
╭━━━°「 *Sifat ${text}* 」°━━━
┃
┃• Nama          : ${text}
┃• Ahlak Baik    : ${randomPersen()}
┃• Ahlak Buruk   : ${randomPersen()}
┃• Orang yang    : ${pickRandom(['Baik Hati', 'Sombong', 'Pelit', 'Dermawan', 'Rendah Hati', 'Rendah Diri', 'Pemalu', 'Penakut', 'Pengusil', 'Cengeng'])}
┃• Selalu        : ${pickRandom([
			'Rajin',
			'Malas',
			'Membantu',
			'Ngegosip',
			'Jail',
			'Gak jelas',
			'Shopping',
			'Chattan sama Doi',
			'Chattan di WA karena Jomblo',
			'Sedih',
			'Kesepian',
			'Bahagia',
			'Ngocok tiap hari',
		])}
┃• Kecerdasan    : ${randomPersen()}
┃• Kenakalan     : ${randomPersen()}
┃• Keberanian    : ${randomPersen()}
┃• Ketakutan     : ${randomPersen()}
╰━━━━━━━━━━━━━━━
`.trim()
	)
}

handler.help = ['ceksifat']
handler.tags = ['fun']
handler.command = /^ceksifat$/i

export default handler

function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)]
}

function randomPersen() {
	return (Math.random() * 100).toFixed(1) + '%'
}
