import { ITEMS, getStats, hasItem, addItem, removeItem, fmt, itemLabel, useBuff, buffText, activeBuff, TRAIT_DESC } from '../lib/rpg.js';

const handler = async (m, { command, text }) => {
	const user = global.db.data.users[m.sender];
	const arg = (text || '').trim().toLowerCase();

	if (command === 'inv' || command === 'inventory') {
		const eq = Object.entries(user.equipment || {})
			.map(([, e]) => {
				const t = ITEMS[e.id]?.trait ? ` [${TRAIT_DESC[ITEMS[e.id].trait]}]` : '';
				return `${itemLabel(e.id)} Lv.${e.lvl}${t}`;
			})
			.join('\n');
		const tools = Object.entries(user.tools || {})
			.map(([, t]) => `${itemLabel(t.id)}`)
			.join('\n');
		const inv = Object.entries(user.inventory)
			.filter(([, q]) => q > 0)
			.map(([id, q]) => `${itemLabel(id)} x${q}`)
			.join('\n');
		const sb = user.statsBonus || {};
		const sbStr = ['atk', 'def', 'hp', 'mana', 'crit']
			.filter((k) => sb[k])
			.map((k) => `${k} +${sb[k]}`)
			.join(', ');
		const buff = activeBuff(user);
		return m.reply(
			`*INVENTORY*\n\n💹 Money: ${fmt(user.money)} | 🏦 Bank: ${fmt(user.bank)}\n` +
				(sbStr ? `📖 Bonus stat: ${sbStr}\n` : '') +
				(Object.keys(buff).length ? `🧪 Buff: ${buffText(user)}\n` : '') +
				`\n*Equipment:*\n${eq || '-'}\n\n*Tools:*\n${tools || '-'}\n\n*Items:*\n${inv || '-'}`
		);
	}

	if (command === 'use') {
		const item = ITEMS[arg];
		if (!item || !hasItem(user, arg)) return m.reply('Item tidak ditemukan di inventory.');
		if (item.type === 'consumable') {
			const s = getStats(user);
			removeItem(user, arg);
			if (item.heal) user.hp = Math.min(s.maxHp, user.hp + item.heal);
			if (item.mana) user.mana = Math.min(s.maxMana, user.mana + item.mana);
			return m.reply(`✅ Menggunakan ${item.emoji} ${item.name}.`);
		}
		if (item.type === 'tome') {
			removeItem(user, arg);
			user.statsBonus = user.statsBonus || {};
			user.statsBonus[item.stat] = (user.statsBonus[item.stat] || 0) + item.value;
			return m.reply(`📖 Membaca ${item.emoji} ${item.name}!\n${item.stat === 'hp' ? 'MaxHP' : item.stat} +${item.value} permanen (total ${user.statsBonus[item.stat]}).`);
		}
		if (item.type === 'buff') {
			removeItem(user, arg);
			useBuff(user, arg);
			return m.reply(`🧪 ${item.emoji} ${item.name} digunakan!\n${buffText(user)}`);
		}
		if (item.type === 'crate') return m.reply(`Buka dengan: .open ${arg}`);
		if (item.type === 'equipment') return m.reply(`Pasang dengan: .equip ${arg}`);
		if (item.type === 'tool') return m.reply(`Pasang dengan: .equip ${arg}`);
		return m.reply('Item tidak bisa digunakan.');
	}

	if (command === 'equip') {
		const item = ITEMS[arg];
		if (!item || !hasItem(user, arg)) return m.reply('Item tidak ditemukan di inventory.');
		if (item.type === 'equipment') {
			removeItem(user, arg);
			const old = user.equipment[item.slot];
			if (old?.id) addItem(user, old.id);
			user.equipment[item.slot] = { id: arg, lvl: 1 };
			return m.reply(`⚔️ ${item.emoji} ${item.name} terpasang.${item.trait ? `\n✨ Trait: ${TRAIT_DESC[item.trait]}` : ''}`);
		}
		if (item.type === 'tool') {
			removeItem(user, arg);
			user.tools[item.slot] = { id: arg, lvl: 1 };
			return m.reply(`${item.emoji} ${item.name} siap digunakan.`);
		}
		return m.reply('Item ini tidak bisa dipasang.');
	}

	if (command === 'unequip') {
		const e = user.equipment[arg];
		if (!e?.id) return m.reply('Slot kosong. Slot: weapon/armor/accessory');
		addItem(user, e.id);
		delete user.equipment[arg];
		return m.reply(`Melepas ${ITEMS[e.id].emoji} ${ITEMS[e.id].name}.`);
	}
};

handler.help = ['inv', 'use', 'equip', 'unequip'];
handler.tags = ['rpg'];
handler.command = /^(inv|inventory|use|pakai|equip|unequip)$/i;
handler.register = true;

export default handler;
