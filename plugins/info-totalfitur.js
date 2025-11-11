let handler = async (m) => {
	let total = Object.values(global.plugins).filter((v) => v.help && v.tags).length

	conn.reply(m.chat, `Total Fitur Bot Saat ini: ${total}`, m, {
		contextInfo: {
			externalAdReply: {
				description: 'anu',
				title: namebot,
				body: 'Total Cintaku Padamu',
				thumbnail,
			},
		},
	})
}

handler.help = ['totalfitur']
handler.tags = ['info']
handler.command = ['totalfitur']
export default handler
