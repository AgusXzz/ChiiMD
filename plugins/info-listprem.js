const handler = async (m) => {
	let response = '• *PREMIUM SUBSCRIPTION*\n\n';
	let totalPremium = 0;

	for (const user in global.db.data.users) {
		if (global.db.data.users[user].premium) {
			const number = user.split('@')[0];
			const name = global.db.data.users[user].name || '';
			const days = Math.abs(Math.floor((global.db.data.users[user].premiumTime - new Date()) / (24 * 60 * 60 * 1000)));
			const hours = Math.abs(Math.floor((global.db.data.users[user].premiumTime - new Date()) / (60 * 60 * 1000))) % 24;
			const minutes = Math.abs(Math.floor((global.db.data.users[user].premiumTime - new Date()) / (60 * 1000))) % 60;

			response += `∝───────•••───────\n◦  *${number}*\n•  ${name}\n*Active period*: ${days} Hari ${hours} Jam ${minutes} Menit\n∝───────•••───────\n`;

			totalPremium++;
		}
	}

	response += `┌  ◦  Total Premium : *${totalPremium}*\n`;
	response += '└  ◦  Upgrade Premium: *.owner*';

	m.reply(response, m.from, {
		contextInfo: {
			mentionedJid: Object.keys(global.db.data.users).filter((jid) => global.db.data.users[jid].premium),
		},
	});
};

handler.help = ['listpremium'];
handler.command = /^(listprem(ium|iums)?)$/i;
handler.tags = ['info'];

export default handler;
