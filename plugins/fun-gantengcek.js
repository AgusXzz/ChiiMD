let handler = async (m, { conn }) => {
	conn.reply(m.chat, pickRandom(ganteng), m)
}

handler.help = ['gantengcek']
handler.tags = ['fun']
handler.command = /^(cekganteng|gantengcek)$/i

export default handler

function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)]
}

const ganteng = [
	'Ganteng Level : 1%\n\nAmbatukam... sabar ya bro, jangan ngaca pas siang bolong.',
	'Ganteng Level : 3%\n\nCermin aja nangis liat muka lo 😭',
	'Ganteng Level : 5%\n\nMuka lo kayak wifi publik, semua bisa dapet tapi ga ada yang mau nyambung.',
	'Ganteng Level : 10%\n\nKatanya ganteng, pas diliat malah ngelag.',
	'Ganteng Level : 15%\n\nKalau lo jadi karakter game, pasti masuk kategori "boss terjelek".',
	'Ganteng Level : 22%\n\nMuka lo ada efek blur bawaan.',
	'Ganteng Level : 30%\n\nLumayan... buat nakutin maling.',
	'Ganteng Level : 38%\n\nDari jauh keren, dari deket ngagetin.',
	'Ganteng Level : 45%\n\nGanteng tipis-tipis, kayak sinyal di gunung.',
	'Ganteng Level : 52%\n\nSetengah ganteng, setengah ambatukam.',
	'Ganteng Level : 60%\n\nBisa lah kalau gelap dikit dan pake filter.',
	'Ganteng Level : 70%\n\nCewek suka… tapi cuma sebagai teman 😔',
	'Ganteng Level : 77%\n\nKalau pake helm full-face, 10/10',
	'Ganteng Level : 83%\n\nAbang-abangan imo 100+ star bikin adek-adek auto naksir.',
	'Ganteng Level : 89%\n\nBikin cewek lupa password IG-nya.',
	'Ganteng Level : 94%\n\nAuto jadi fyp cewek-cewek TikTok.',
	'Ganteng Level : 97%\n\nKalo nongol, cermin nyalamin dulu.',
	'Ganteng Level : 100%\n\nLU EMANG COWOK TERGANTENG SEALAM SEMESTA!! 😎🔥',
]
