let handler = async (m, { conn }) => {
	let user = global.db.data.users[m.sender];

	let { lastberburu, lastbansos, lastadventure, lastfishing, lastwar, lastduel, lastmining, lastdungeon, lastclaim, lastweekly, lastmonthly } = user;

	let str = `
*—「 Cooldown 」—*
*Last Berburu :* ${lastberburu > 0 ? '❌' : '✅'}
*Last Memancing :* ${lastfishing > 0 ? '❌' : '✅'}
*Last Adventure :* ${lastadventure > 0 ? '❌' : '✅'}
*Last Duel :* ${lastduel > 0 ? '❌' : '✅'}
*Last War :* ${lastwar > 0 ? '❌' : '✅'}
*Last Dungeon :* ${lastdungeon > 0 ? '❌' : '✅'}
*Last Mining :* ${lastmining > 0 ? '❌' : '✅'}
*Last Bansos :* ${lastbansos > 0 ? '❌' : '✅'}
*Last Claim :* ${lastclaim > 0 ? '❌' : '✅'}
*Last Weekly :* ${lastweekly > 0 ? '❌' : '✅'}
*Last Monthly :* ${lastmonthly > 0 ? '❌' : '✅'}
`.trim();

	conn.reply(m.chat, str, m);
};

handler.help = ['cooldown'];
handler.tags = ['rpg'];
handler.command = /^(cd|cooldown)$/i;
handler.group = true;
export default handler;
