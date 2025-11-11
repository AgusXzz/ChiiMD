let handler = async (m, { conn, usedPrefix, command, text }) => {
	conn.khodam = conn.khodam || {}

	if (!text) return m.reply(`Masukkan nama kamu!\n\nContoh:\n${usedPrefix + command} Abay gay`)

	let data = conn.khodam[text] || pickRandom(khodamList)
	conn.khodam[text] = data

	let result = `
👤 Nama: *${text}*
🔮 Khodam kamu adalah: *${data.nama}*

📖 Penjelasan:
${data.deskripsi}
  `.trim()

	await m.reply(result)
}

handler.help = ['cekkhodam']
handler.tags = ['fun']
handler.command = /^(cek(khodam|kodam)|kodam|khodam)$/i

export default handler

function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)]
}

const khodamList = [
	{ nama: 'Kucing Rawa', deskripsi: 'Berkeliaran di rawa, suka ngeong bareng genderuwo' },
	{ nama: 'Biawak Samudra', deskripsi: 'Punya insang, tapi alergi air' },
	{ nama: 'Kipas Angin', deskripsi: 'Suka muter tapi diem di tempat' },
	{ nama: 'Farhan Kebab', deskripsi: 'Kalau dipanggil langsung bikin lapar' },
	{ nama: 'Rossi Becak', deskripsi: 'Juara MotoGP tapi naik becak' },
	{ nama: 'Karyawan Indomaret', deskripsi: 'Senyumnya ga pernah habis, kayak promo diskon' },
	{ nama: 'Peti Harta', deskripsi: 'Bisa isi emas, bisa isi utang' },
	{ nama: 'Kuntilanak Lucu', deskripsi: 'Suka ngelawak, bikin tuyul ketawa' },
	{ nama: 'Pocong berkepala 3', deskripsi: 'Kepalanya banyak, tapi isi tetep kosong' },
	{ nama: 'Pace Yunus', deskripsi: 'Pace legendaris, bisa main bola sambil terbang' },
	{ nama: 'Kepala Casan', deskripsi: 'Bisa ngisi baterai, tapi suka overheat' },
	{ nama: 'Pisang Hijau', deskripsi: 'Manisnya menipu, kayak mantan' },
	{ nama: 'Zebra Merah', deskripsi: 'Langka, cuma muncul kalau kamu ngutang' },
	{ nama: 'Handuk Basah', deskripsi: 'Nempel terus, terutama pas abis mandi' },
	{ nama: 'Tuyul', deskripsi: 'Ahli ekonomi gelap. Master dompet kosong' },
	{ nama: 'Titid Kuda', deskripsi: "Kekuatan mistis paling 'overpower'" },
	{ nama: 'Torpedo Kambing', deskripsi: 'Bisa meledak kalo disentil' },
	{ nama: 'Semut Hitam', deskripsi: 'Kecil tapi suka ngerusuh di dapur' },
	{ nama: 'Naga Merah', deskripsi: 'Suka muncul pas listrik padam' },
	{ nama: 'Barbie', deskripsi: 'Cantik tapi gak bisa masak' },
	{ nama: 'Gondoruwo Ganteng', deskripsi: 'Gondoruwo versi boyband' },
	{ nama: 'Bocah Santet', deskripsi: 'Kecil-kecil cabut uban tetangga' },
	{ nama: 'Celana Dalam Hilang', deskripsi: 'Sumber misteri terbesar di kosan' },
	{ nama: 'Susu Tumpah', deskripsi: 'Suka bikin lantai licin dan hati was-was' },
	{ nama: 'Ikan Gabus Terbang', deskripsi: 'Terbang kalau ngantuk' },
	{ nama: 'Bantal Bau', deskripsi: 'Pelindung tidur dan pelumpuh lawan' },
	{ nama: 'Spatula Sakti', deskripsi: 'Kalau dilempar, bisa balik sendiri' },
	{ nama: 'Sapu Terbang KW', deskripsi: 'Cuma bisa melayang 3 cm' },
	{ nama: 'Singa Berkacamata', deskripsi: 'Matanya minus, tapi tetap galak' },
	{ nama: 'Genderuwo Fashion Week', deskripsi: 'Serem tapi stylish' },
	{ nama: 'Nenek Lampir Reborn', deskripsi: 'Versi muda, doyan TikTok' },
	{ nama: 'Penghapus Gaib', deskripsi: 'Bisa hapus memori mantan' },
	{ nama: 'Wajan Terbang', deskripsi: 'Senjata ibu-ibu ultimate' },
	{ nama: 'Kodok Imut', deskripsi: 'Croak-nya bikin orang jatuh cinta' },
	{ nama: 'Bakwan Mistis', deskripsi: 'Kalau dibakar, keluar mantra' },
	{ nama: 'Aqua Isi Ulang', deskripsi: 'Suci, tapi waspada bakteri' },
	{ nama: 'Kulkas Berhantu', deskripsi: 'Isi dikit, bunyi banyak' },
	{ nama: 'Sendal Jepit Arwah', deskripsi: 'Sakitnya sampe ke hati' },
	{ nama: 'Kepiting Labil', deskripsi: 'Kadang nyapit, kadang nangis' },
	{ nama: 'Odol Kering', deskripsi: 'Tak berguna tapi tetap ada di kamar mandi' },
	{ nama: 'Rambutan Setan', deskripsi: 'Duri halus, isi horor' },
	{ nama: 'Sate Terbang', deskripsi: 'Bisa ngilang kalo ga dijaga' },
	{ nama: 'Kopi Pahit', deskripsi: 'Penyeduh galau dan kesadaran' },
	{ nama: 'Bajigur Penunggu', deskripsi: 'Hangat, tapi bikin merinding' },
	{ nama: 'Cendol Berdarah', deskripsi: 'Dibeli di alam lain' },
	{ nama: 'Bakso Kepala Ular', deskripsi: 'Kenyal, tapi tajam' },
	{ nama: 'Obeng Sakti', deskripsi: 'Bisa buka nasib orang' },
	{ nama: 'TV Rusak', deskripsi: 'Gambarnya semut, isinya tuyul' },
	{ nama: 'Tissue Bekas', deskripsi: 'Khodam mantan yang susah dilupakan' },
	{ nama: 'Tenda Bocor', deskripsi: 'Bikin kamu deket sama air dan penderitaan' },
	{ nama: 'Celengan Menangis', deskripsi: 'Kalau dibuka, isinya utang' },
	{ nama: 'Ayam Berkaki 5', deskripsi: 'Kenceng lari, bingung sepatu' },
	{ nama: 'Kentang Hidup', deskripsi: 'Goreng dikit kabur' },
	{ nama: 'Sumpit Mistis', deskripsi: 'Cocok untuk narik energi negatif' },
	{ nama: 'Gelas Retak', deskripsi: 'Mudah pecah, seperti hubungan kita' },
	{ nama: 'Topi Anti Jodoh', deskripsi: 'Dipake = jomblo seumur hidup' },
	{ nama: 'Senter Kesurupan', deskripsi: 'Kadang nyala, kadang sholat sendiri' },
	{ nama: 'Dasi Terkutuk', deskripsi: 'Siapapun pake jadi bucin' },
	{ nama: 'Mie Goreng Mistis', deskripsi: 'Wangi sedap, bikin lupa dunia' },
	{ nama: 'Serabi Alien', deskripsi: 'Rasa tak dikenal umat manusia' },
	{ nama: 'HP Lag', deskripsi: 'Khodam sabar tingkat dewa' },
	{ nama: 'Remote TV Tersesat', deskripsi: 'Bisa muncul di kulkas' },
	{ nama: 'Lampu Redup', deskripsi: 'Bikin aura horror padahal siang' },
	{ nama: 'Tikus Sakti', deskripsi: 'Bisa mencuri mie instan' },
	{ nama: 'Tali Jemuran Halimun', deskripsi: 'Hilang kalau hujan' },
	{ nama: 'Jaket Bau Surga', deskripsi: 'Baunya aneh tapi adem di hati' },
	{ nama: 'Boneka Misteri', deskripsi: 'Senyumnya nyiksa batin' },
	{ nama: 'Klakson Kuntilanak', deskripsi: 'Sekali bunyi, tetangga pingsan' },
	{ nama: 'Obat Nyamuk Gagal', deskripsi: 'Makin dipake makin rame nyamuk' },
	{ nama: 'Korek Api Emosian', deskripsi: 'Nyala pas ga dibutuhin doang' },
	{ nama: 'Cermin Sakti', deskripsi: 'Kalau kamu liat, wajah jadi mantan' },
	{ nama: 'Bedak Gaib', deskripsi: 'Dipake ilang, muka ikut ilang' },
]
