import { NPC_LIST, ITEMS, RECIPES, storyFor, getStats, fmt, sendBtn, BTN } from '../lib/rpg.js';

const TRAIN = {
	atk: { name: 'ATK', cost: 5000, unit: 2 },
	def: { name: 'DEF', cost: 5000, unit: 2 },
	hp: { name: 'MaxHP', cost: 5000, unit: 20 },
	mana: { name: 'MaxMana', cost: 5000, unit: 20 },
	crit: { name: 'Crit', cost: 10000, unit: 1 },
};

let handler = async function (m, { args }) {
	const user = global.db.data.users[m.sender];
	const name = (args[0] || '').toLowerCase();
	const npc = name ? NPC_LIST.find((n) => n.id === name || n.name.toLowerCase().includes(name)) : null;

	if (!npc) {
		const list = NPC_LIST.map((n) => `${n.emoji} ${n.name} (${n.area})`).join('\n');
		const serviceBtns = NPC_LIST.filter((n) => n.type === 'service').map((n) => BTN(`${n.emoji} ${n.name.split(' ').pop()}`, `.npc ${n.id}`));
		return sendBtn(this, m, `*NPC DI DUNIA ATHERIA*\n\n${list}\n\nNgobrol: .npc <nama>`, serviceBtns);
	}

	if (npc.type === 'story') {
		const chapter = storyFor(user);
		const hint = chapter.id === npc.chapter ? `\n\n📖 *Petunjuk Bab ${chapter.id}:* ${chapter.intro}` : '';
		return m.reply(`${npc.emoji} *${npc.name}*\n${npc.text}${hint}`);
	}

	// service NPC
	if (npc.id === 'garrick') {
		return m.reply(`${npc.emoji} *${npc.name}*\n${npc.text}\n\n🔨 .craft <nama> — buat item\n⬆️ .upgrade <slot> — naikkan level`);
	}
	if (npc.id === 'lyra') {
		const list = RECIPES.filter((r) => ['tome', 'buff'].includes(ITEMS[r.result]?.type) || ITEMS[r.result]?.source === 'craft')
			.map((r) => `${ITEMS[r.result].emoji} ${r.name} — ${r.need.map(([id, q]) => `${ITEMS[id].name} x${q}`).join(', ')}`)
			.join('\n');
		return m.reply(`${npc.emoji} *${npc.name}*\n${npc.text}\n\n⚗️ *Resep tersedia:*\n${list}\n\nCraft: .craft <nama>`);
	}
	if (npc.id === 'duncan') {
		const stat = (args[1] || '').toLowerCase();
		if (TRAIN[stat]) {
			const t = TRAIN[stat];
			if (user.money < t.cost) return m.reply(`Butuh 💹 ${fmt(t.cost)} untuk melatih ${t.name}.`);
			user.money -= t.cost;
			user.statsBonus = user.statsBonus || {};
			user.statsBonus[stat] = (user.statsBonus[stat] || 0) + t.unit;
			return m.reply(`💪 ${t.name} +${t.unit}! (total bonus: ${user.statsBonus[stat]})\n-💹 ${fmt(t.cost)}`);
		}
		const list = Object.entries(TRAIN)
			.map(([k, t]) => `• ${t.name} — 💹 ${fmt(t.cost)} (+${t.unit}) → .npc aldric ${k}`)
			.join('\n');
		const s = getStats(user);
		return m.reply(`${npc.emoji} *${npc.name}*\n${npc.text}\n\n*Stat dasar:* ATK ${s.atk} | DEF ${s.def} | HP ${s.maxHp} | MP ${s.maxMana} | Crit ${s.crit}%\n\n${list}`);
	}
	if (npc.id === 'elara') {
		const cost = 2000;
		const s = getStats(user);
		if (args[1] === 'heal') {
			if (user.hp >= s.maxHp && user.mana >= s.maxMana) return m.reply('Kamu sudah sehat.');
			if (user.money < cost) return m.reply(`Butuh 💹 ${fmt(cost)}.`);
			user.money -= cost;
			user.hp = s.maxHp;
			user.mana = s.maxMana;
			return m.reply(`💖 Kamu disembuhkan penuh! -💹 ${fmt(cost)}`);
		}
		return m.reply(`${npc.emoji} *${npc.name}*\n${npc.text}\n\nPulihkan HP & Mana penuh seharga 💹 ${fmt(cost)}.\n\nGunakan: .npc sera heal`);
	}
	if (npc.id === 'silas') {
		return m.reply(`${npc.emoji} *${npc.name}*\n${npc.text}\n\n🛒 .shop — lihat dagangan\n💰 .sell <item> <qty> — jual item`);
	}

	return m.reply(`${npc.emoji} *${npc.name}*\n${npc.text}`);
};

handler.command = ['npc'];
handler.tags = ['rpg'];
handler.register = true;

export default handler;
