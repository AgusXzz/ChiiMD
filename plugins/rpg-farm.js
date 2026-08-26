import { CROPS, ITEMS, farmSlots, hasItem, addItem, removeItem, questTrack, guildExp, grantAchievements, sendBtn, BTN } from '../lib/rpg.js';

const handler = async function (m, { command, text }) {
	const user = global.db.data.users[m.sender];
	const farm = user.farm;
	const cap = farmSlots(user);
	while (farm.slots.length < cap) farm.slots.push(null);

	if (command === 'farm') {
		const s = farm.slots.map((sl, i) => {
			if (!sl?.seed) return `${i + 1}. Kosong`;
			const crop = CROPS[sl.seed];
			const ready = Date.now() >= sl.readyAt;
			return `${i + 1}. ${crop.emoji} ${crop.name} ${ready ? '✅ SIAP PANEN' : '⏳ ' + Math.ceil((sl.readyAt - Date.now()) / 1000) + 's'}`;
		});
		return sendBtn(this, m, `*FARM* (${farm.slots.filter((sl) => sl?.seed).length}/${cap})\n\n${s.join('\n') || 'Semua slot kosong.'}\n\nTanam: .tanam <bibit>`, [BTN('🌾 Panen', '.panen')]);
	}

	if (command === 'tanam') {
		const id = text.trim().toLowerCase();
		const crop = CROPS[id];
		if (!crop) return m.reply(`Bibit tidak valid. Bibit: ${Object.keys(CROPS).join(', ')}`);
		if (!hasItem(user, id)) return m.reply('Kamu tidak punya bibit itu. Beli di .shop');
		const free = farm.slots.findIndex((sl) => !sl?.seed);
		if (free === -1) return m.reply(`Semua slot terisi (${cap}).`);
		removeItem(user, id);
		farm.slots[free] = { seed: id, plantedAt: Date.now(), readyAt: Date.now() + crop.grow };
		return m.reply(`🌱 Menanam ${crop.emoji} ${crop.name}. Siap panen dalam ${Math.round(crop.grow / 60000)} menit.`);
	}

	if (command === 'panen') {
		const got = [];
		farm.slots.forEach((sl, i) => {
			if (!sl?.seed || Date.now() < sl.readyAt) return;
			const crop = CROPS[sl.seed];
			addItem(user, crop.yield, crop.yieldQty);
			got.push(`${crop.emoji} ${ITEMS[crop.yield].name} x${crop.yieldQty}`);
			farm.slots[i] = null;
		});
		if (!got.length) return m.reply('Belum ada yang siap dipanen.');
		questTrack(user, 'harvests', got.length);
		guildExp(user, 5 * got.length);
		user.count = user.count || {};
		user.count.harvest = (user.count.harvest || 0) + got.length;
		grantAchievements(user);
		user.exp += got.length * 10;
		return m.reply(`🌾 *Panen berhasil!*\n\n${got.join('\n')}\n\n✨ +${got.length * 10} XP`);
	}
};

handler.help = ['farm', 'tanam', 'panen'];
handler.tags = ['rpg'];
handler.command = /^(farm|tanam|panen)$/i;
handler.register = true;

export default handler;
