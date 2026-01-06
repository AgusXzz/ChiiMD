let handler = async (m, { conn }) => {
	try {
		const user = global.db.data.users[m.sender];

		const cooldown = 3600000;
		const now = Date.now();

		const diff = now - user.lastadventure;
		const timers = clockString(cooldown - diff);

		if (user.health < 80)
			return m.reply(
				'Minimal 80 Health Untuk Bisa Berpetualang\nKamu Bisa Menggunakan Potion Dengan Cara *.heal*\nJika Tidak Mempunyai Potion Kamu Bisa Beli Dengan Cara *.buy potion (jumlah)*'
			);

		if (diff < cooldown) return m.reply(`Kamu Sudah Berpetualang Hari Ini, Istirahat Selama *${timers}*`);

		const health = Math.floor(Math.random() * 101);
		const exp = Math.floor(Math.random() * 10000);
		const uang = Math.floor(Math.random() * 100000);
		const trash = Math.floor(Math.random() * 10000);
		const emerald = Math.floor(Math.random() * 100);

		const _potion = makeInt('rand', 3);
		const _sampah = makeInt('anu', 50);
		const _diamond = makeInt('anu', 10);
		const _common = makeInt('anu', 3);
		const _uncommon = makeInt('rand', 4);
		const _mythic = makeInt('rand', 5, 3);
		const _legendary = makeInt('rand', 5, 3);

		const potion = pickRandom(_potion);
		const sampah = pickRandom(_sampah);
		const diamond = pickRandom(_diamond);
		const common = pickRandom(_common);
		const uncommon = pickRandom(_uncommon);
		const mythic = pickRandom(_mythic);
		const legendary = pickRandom(_legendary);

		const itemrand = [`*${mythic} Peti Mistis Langka*`, `*${legendary} Peti Legendary Langka*`];

		const str = `
Nyawa Mu Berkurang Sebesar -${health}, Karena Kamu Berpetualang Dan Melawan ${pickRandom(['Raksasa', 'Beruang', 'Harimau', 'Macan', 'Iblis'])} Tapi Kamu Mendapatkan:

*Exp:* ${exp} 
*Uang:* ${uang}
*Berlian:* ${diamond}
*Emerald:* ${emerald}
*Sampah:* ${sampah}
${potion == 0 ? '' : '*Potion:* ' + potion}
${common == 0 ? '' : '*Common crate:* ' + common}
${uncommon == 0 ? '' : '*Uncommon crate:* ' + uncommon}

Dan Mendapatkan ${itemrand}
`.trim();

		conn.adReply(m.chat, str, 'https://c4.wallpaperflare.com/wallpaper/755/258/362/action-adventure-anime-chronicles-wallpaper-preview.jpg', m);

		user.health -= health;
		user.exp += exp;
		user.money += uang;
		user.potion += potion;
		user.diamond += diamond;
		user.emerald += emerald;
		user.trash += trash;
		user.common += common;
		user.uncommon += uncommon;
		user.mythic += mythic;
		user.legendary += legendary;
		user.lastadventure = now;
	} catch (e) {
		console.error(e);
		m.reply('Error');
	}
};

handler.help = ['petualang'];
handler.tags = ['rpg'];
handler.command = /^(petualang|adventure)$/i;
handler.group = true;

export default handler;

function makeInt(type, total, maxNumber = 3) {
	if (type === 'anu') {
		return Array.from({ length: total }, (_, i) => i + 1);
	}

	if (type === 'rand') {
		return Array.from({ length: total }, () => Math.floor(Math.random() * maxNumber) + 1);
	}
}

function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)];
}

function clockString(ms) {
	let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
	let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
	let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
	let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
	return ['\n' + d, ' *Hari*\n ', h, ' *Jam*\n ', m, ' *Menit*\n ', s, ' *Detik* '].map((v) => v.toString().padStart(2, 0)).join('');
}
