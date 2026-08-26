const handler = async (m) => {
	const res = await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/kata-kata/truth.json');
	const result = await res.json();

	const truth = result.getRandom();
	m.reply(truth);
};

handler.help = ['truth'];
handler.tags = ['fun'];
handler.command = /^(truth)$/i;

export default handler;
