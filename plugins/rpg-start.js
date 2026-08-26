import { CLASSES, ITEMS, getStats, addItem, removeItem, sendBtn, BTN, guild, fmt } from '../lib/rpg.js';

function showProfile(conn, m, user) {
	const s = getStats(user);
	const cls = user.class ? CLASSES[user.class] : null;
	const g = guild(user);
	const eq = Object.entries(user.equipment || {})
		.map(([, e]) => `${ITEMS[e.id]?.emoji} ${ITEMS[e.id]?.name} Lv.${e.lvl}`)
		.join('\n');
	const inv = Object.entries(user.inventory)
		.filter(([, q]) => q > 0)
		.map(([id, q]) => `${ITEMS[id]?.emoji} ${ITEMS[id]?.name} x${q}`)
		.join('\n');
	const area = user.area || 'forest';
	const sb = user.statsBonus || {};
	const sbStr = ['atk', 'def', 'hp', 'mana', 'crit']
		.filter((k) => sb[k])
		.map((k) => `${k}+${sb[k]}`)
		.join(', ');
	const achCount = user.ach?.claimed?.length || 0;
	return sendBtn(
		conn,
		m,
		`*PROFILE* — ${cls ? cls.emoji + ' ' + cls.name : '❓ Belum pilih kelas'}\n` +
			(user.title ? `🏅 Gelar: ${user.title}\n` : '') +
			`📖 Bab cerita: ${user.story?.chapter || 1}\n` +
			`Level: ${user.level} | Role: ${user.role}\n` +
			`❤️ HP: ${user.hp}/${s.maxHp} | 🔷 Mana: ${user.mana}/${s.maxMana}\n` +
			`⚔️ ATK: ${s.atk} | 🛡️ DEF: ${s.def} | 💥 Crit: ${s.crit}%\n` +
			(sbStr ? `📖 Bonus: ${sbStr}\n` : '') +
			`💹 Money: ${fmt(user.money)} | 🏦 Bank: ${fmt(user.bank)}\n` +
			`🗺️ Area: ${area} | 🗡️ Kills: ${user.kills} | 💀 Deaths: ${user.deaths}\n` +
			`🏆 Menang: ${user.wins} | Kalah: ${user.losses} | Boss: ${user.bossKills}\n` +
			`🎖️ Achievement: ${achCount}\n` +
			(g ? `🏰 Guild: ${g.name}\n` : '') +
			`\n*Equipment:*\n${eq || '-'}\n\n*Inventory:*\n${inv || '-'}`,
		[BTN('⚔️ Explore', '.explore'), BTN('🎒 Inventori', '.inv'), BTN('📖 Story', '.story'), BTN('🏆 Top', '.top')]
	);
}

const handler = async function (m, { command, args }) {
	const user = global.db.data.users[m.sender];
	if (command === 'profile') return showProfile(this, m, user);

	if (user.class) return m.reply(`Kamu sudah memilih kelas *${CLASSES[user.class].emoji} ${CLASSES[user.class].name}*.`);
	const arg = (args[0] || '').toLowerCase();
	if (!arg) {
		const list = Object.entries(CLASSES)
			.map(
				([, c]) =>
					`${c.emoji} *${c.name}* — ${c.desc}\nHP ${c.base.hp} | MP ${c.base.mana} | ATK ${c.base.atk} | DEF ${c.base.def} | Crit ${c.base.crit}%\nSkill: ${c.skill.name} (${c.skill.desc})`
			)
			.join('\n\n');
		return sendBtn(
			this,
			m,
			`*PILIH KELAS*\n\n${list}\n\nPilih kelas di bawah:`,
			Object.entries(CLASSES).map(([k, c]) => BTN(`${c.emoji} ${c.name}`, `.kelas ${k}`))
		);
	}
	if (!CLASSES[arg]) return m.reply('Kelas tidak ditemukan. Pilihan: ' + Object.keys(CLASSES).join(', '));
	user.class = arg;
	const s = getStats(user);
	user.hp = s.maxHp;
	user.mana = s.maxMana;
	user.area = 'forest';
	addItem(user, 'potion', 3);
	user.equipment.weapon = { id: 'wooden_sword', lvl: 1 };
	user.tools.pickaxe = { id: 'pickaxe_wood', lvl: 1 };
	user.tools.axe = { id: 'axe_wood', lvl: 1 };
	user.tools.rod = { id: 'rod_wood', lvl: 1 };
	removeItem(user, 'wooden_sword');
	return m.reply(`✅ Kelas terpilih: *${CLASSES[arg].emoji} ${CLASSES[arg].name}*\n\nStarter: Potion x3, Pedang Kayu, dan tools dasar (belicung/kapak/pancing).\n\nJelajah: \`.explore\``);
};

handler.help = ['kelas', 'profile'];
handler.tags = ['rpg'];
handler.command = /^(kelas|start|profile)$/i;
handler.register = true;

export default handler;
