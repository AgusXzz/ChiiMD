const cooldown = 300000;
let handler = async (m) => {
	let user = global.db.data.users[m.sender];
	let now = Date.now();
	let timers = cooldown - (now - user.lastmining);
	if (user.stamina < 20) return m.reply('Kamu Kelelahan\nHeal Terlebih dahulu supaya bisa menambang.');
	if (user.pickaxe < 1) return m.reply('Mau mining ga punya pickaxe 🗿');
	if (now - user.lastmining <= cooldown) return m.reply(`Kamu Sudah Menambang!!, Tunggu selama *🕐${timers.toTimeString()}*`);
	const rewards = reward();
	let text = 'Kamu Telah Menambang dan tersesat';
	for (const lost in rewards.lost)
		if (user[lost]) {
			const total = rewards.lost[lost].getRandom();
			user[lost] -= total * 1;
			if (total) text += `\n*${global.rpg.emoticon(lost)}${lost}:* ${toRupiah(total)}`;
		}
	text += '\n\nTapi Kamu Mendapatkan';
	for (const rewardItem in rewards.reward)
		if (rewardItem in user) {
			const total = rewards.reward[rewardItem].getRandom();
			user[rewardItem] += total * 1;
			if (total) text += `\n*${global.rpg.emoticon(rewardItem)}${rewardItem}:* ${toRupiah(total)}`;
		}
	m.reply(text);
	user.lastmining = now;
};
handler.help = ['mining'];
handler.tags = ['rpg'];
handler.command = /^(mining)$/i;
handler.register = true;
handler.group = true;
export default handler;

function reward() {
	let rewards = {
		reward: {
			exp: 1000,
			trash: 101,
			string: 25,
			rock: 30,
			iron: 25,
			emerald: [1, 4, 0, 0, 3],
			common: [10, 40, 82, 100, 3],
			uncommon: [34, 5, 23, 81],
			mythic: [12, 4, 0, 1, 0],
			legendary: [0, 0, 5, 1, 6, 2, 0, 0],
			gold: [0, 0, 0, 0, 0, 1, 0],
			diamond: [7, 2, 5, 0, 3, 0, 1, 0],
		},
		lost: {
			stamina: 20,
			pickaxedurability: 10,
		},
	};
	return rewards;
}

const toRupiah = (number) => parseInt(number).toLocaleString().replace(/,/gi, '.');
