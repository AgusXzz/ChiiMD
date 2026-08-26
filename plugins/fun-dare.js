const handler = async (m) => {
	const res = await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/kata-kata/dare.json');
	const result = await res.json();

	const dare = result.getRandom();
	m.reply(dare);
};
handler.help = ['dare'];
handler.tags = ['fun'];
handler.command = /^(dare)$/i;

export default handler;
