import fetch from 'node-fetch'
//follow ig @elyas_tzy ya sayangkuhhh
//f0llow ig @elyas_tzy ya sayangkuhhh
const couriers = [
  { code: "jne", name: "JNE Express" },
  { code: "pos", name: "POS Indonesia" },
  { code: "jnt", name: "J&T Express" },
  { code: "jnt_cargo", name: "J&T Cargo" },
  { code: "sicepat", name: "SiCepat" },
  { code: "tiki", name: "TIKI" },
  { code: "anteraja", name: "AnterAja" },
  { code: "wahana", name: "Wahana" },
  { code: "ninja", name: "Ninja Express" },
  { code: "lion", name: "Lion Parcel" },
  { code: "pcp", name: "PCP Express" },
  { code: "jet", name: "JET Express" },
  { code: "rex", name: "REX Express" },
  { code: "first", name: "First Logistics" },
  { code: "ide", name: "ID Express" },
  { code: "spx", name: "Shopee Express" },
  { code: "kgx", name: "KGXpress" },
  { code: "sap", name: "SAP Express" },
  { code: "rpx", name: "RPX" },
  { code: "lex", name: "Lazada Express" },
  { code: "indah_cargo", name: "Indah Cargo" },
  { code: "dakota", name: "Dakota Cargo" },
  { code: "kurir_tokopedia", name: "Kurir Tokopedia" }
]

let handler = async (m, { conn, args, usedPrefix, command }) => {
const el_api = 'f76b9f991fe424356b9c6da407792b1d1fbf33ad7a197bd0755b557a05461262' 
//500 req/minggu, bikin aja sendiri gratis di https://api.binderbyte.com
//follow ig @elyas_tzy ya sayangkuhhh
  if (!args[0]) {
    return m.reply(`Masukkan nomor resi\nContoh:\n${usedPrefix + command} 81902xxxx`)
  }

  if (args.length == 1) {

    let resi = args[0]

    let buttons = [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "Pilih Kurir",
          sections: [
            {
              title: "Daftar Kurir",
              rows: couriers.map(v => ({
                title: v.name,
                description: `Cek resi via ${v.name}`,
                id: `${usedPrefix + command} ${v.code} ${resi}`
              }))
            }
          ]
        })
      }
    ]

    return conn.sendButton(
      m.chat,
      {
        text: `📦 *CEK RESI PAKET*\n\nNomor Resi: *${resi}*\n\nSilakan pilih kurir pengiriman.`,
        footer: "Tracking Paket",
        buttons
      },
      { quoted: m }
    )
  }

  let courier = args[0].toLowerCase()
  let resi = args[1]

  if (!couriers.find(v => v.code == courier)) {
    return m.reply(`Kurir *${courier}* tidak tersedia`)
  }

  if (!resi) {
    return m.reply(`Masukkan nomor resi\nContoh:\n${usedPrefix + command} ${courier} 81902xxxx`)
  }

  try {

    let res = await fetch(`https://api.binderbyte.com/v1/track?api_key=${el_api}&courier=${courier}&awb=${resi}`)
    let elres = await res.json()

    let teks = `📦 *TRACKING RESI*\n\n`
    teks += `Status: ${elres.status}\n`
    teks += `Pesan: ${elres.message}\n\n`

    teks += `*Ringkasan*\n`
    teks += `AWB: ${elres.data.summary.awb}\n`
    teks += `Kurir: ${elres.data.summary.courier}\n`
    teks += `Layanan: ${elres.data.summary.service}\n`
    teks += `Status: ${elres.data.summary.status}\n`
    teks += `Tanggal: ${elres.data.summary.date}\n`
    teks += `Deskripsi: ${elres.data.summary.desc}\n`
    teks += `Biaya: ${elres.data.summary.amount}\n`
    teks += `Berat: ${elres.data.summary.weight}\n\n`

    teks += `*Detail*\n`
    teks += `Asal: ${elres.data.detail.origin}\n`
    teks += `Tujuan: ${elres.data.detail.destination}\n`
    teks += `Pengirim: ${elres.data.detail.shipper}\n`
    teks += `Penerima: ${elres.data.detail.receiver}\n\n`

    teks += `*Riwayat*\n`
    elres.data.history.forEach((v, i) => {
      teks += `${i + 1}. ${v.date}\n`
      teks += `   ${v.desc}\n`
      teks += `   ${v.location}\n\n`
    })

    conn.sendMessage(m.chat, { text: teks }, { quoted: m })

  } catch (e) {
    m.reply('Resi tidak ditemukan atau API error')
  }

}

handler.help = ['cekresi']
handler.tags = ['tools']
handler.command = /^cekresi$/i

export default handler
