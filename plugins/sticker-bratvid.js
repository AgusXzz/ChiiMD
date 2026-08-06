import axios from "axios";
let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("Contoh:\n.bratvid elyas ganteng banget follow elyas_tzy");
  try {
    await m.reply("⏳ Membuat brat video...");
    let url = `https://skyzxu-brat.hf.space/brat-animated?text=${encodeURIComponent(text)}`;
    await conn.sendSticker(m.chat, url, m, {
      packname: stickpack,
      author: stickauth
    });
  } catch (e) {
    console.error(e);
    m.reply("❌ Gagal membuat bratvid.");
  }
};

handler.help = ["bratvid <text>"];
handler.tags = ["sticker"];
handler.command = /^bratvid$/i;

export default handler;
