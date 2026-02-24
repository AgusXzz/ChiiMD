import axios from 'axios';
let handler = async (m) => {
	const res = await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/kata-kata/truth.json');
	const result = await res.json();

	let truth = result.data.getRandom();
	m.reply(truth);
};

handler.help = ['truth'];
handler.tags = ['fun'];
handler.command = /^(truth)$/i;

export default handler;
