
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'

let handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/video/.test(mime)) {
      throw 'Reply atau kirim video dengan caption .tomp3'
    }

    await m.reply('⏳ Converting to MP3...')

    const media = await q.download()
    if (!media) throw 'Gagal download video!'

    const input = `./tmp/${Date.now()}.mp4`
    const output = `./tmp/${Date.now()}.mp3`

    fs.writeFileSync(input, media)

    await new Promise((resolve, reject) => {
      ffmpeg(input)
        .noVideo()
        .audioCodec('libmp3lame')
        .format('mp3')
        .save(output)
        .on('end', resolve)
        .on('error', reject)
    })

    await conn.sendMessage(
      m.chat,
      {
        audio: fs.readFileSync(output),
        mimetype: 'audio/mpeg'
      },
      { quoted: m }
    )

    fs.unlinkSync(input)
    fs.unlinkSync(output)

  } catch (e) {
    console.log(e)
    m.reply('❌ ' + e)
  }
}

handler.help = ['tomp3']
handler.tags = ['tools']
handler.command = /^(tomp3|toaudio)$/i

export default handler
