import { areaById, pick, scaledMob, rollLoot, applyLoot, startBattle, onCooldown, cdMs, questTrack, fmt, ITEMS, useBuff, addItem, guildExp, sendBtn, BTN } from '../lib/rpg.js';

const AGAIN = [BTN('🌿 Jelajah lagi', '.explore')];

const handler = async function (m) {
	const user = global.db.data.users[m.sender];
	if (!user.class) return m.reply('Pilih kelas dulu: .kelas');
	if (onCooldown(user, 'explore', cdMs(user, 90 * 1000), m, 'explore')) return;
	const area = areaById(user.area);
	questTrack(user, 'explores', 1);
	const r = Math.random();
	if (r < 0.42) {
		const mob = scaledMob(pick(area.mobs), user.level);
		return startBattle(this, m, user, mob, { area, source: 'explore' });
	}
	if (r < 0.6) {
		const loot = rollLoot(user, {});
		const items = applyLoot(user, loot);
		user.money += loot.money;
		user.exp += loot.exp;
		return sendBtn(this, m, `🪙 Kamu menemukan harta di *${area.name}*!\n\n${items}${loot.money ? `\n💹 +${fmt(loot.money)} money` : ''}\n✨ +${loot.exp} XP`, AGAIN);
	}
	if (r < 0.7) {
		const dmg = Math.min(user.hp, Math.round(10 + user.level * 1.5));
		user.hp -= dmg;
		return sendBtn(this, m, `⚠️ Terkena perangkap di *${area.name}*! -${dmg} HP.`, AGAIN);
	}
	if (r < 0.82) return encounter(this, m, user, area);
	return sendBtn(this, m, `🌿 Kamu menjelajah *${area.name}*, tidak ada apa-apa...`, AGAIN);
};

function encounter(conn, m, user, area) {
	const kind = pick(['merchant', 'hunter', 'sage', 'map']);
	if (kind === 'merchant') {
		const item = pick(['potion', 'elixir', 'ramuan_kekuatan', 'iron', 'herb']);
		const price = Math.round((ITEMS[item].price || 200) * 0.6);
		if (user.money >= price) {
			user.money -= price;
			addItem(user, item);
			return sendBtn(conn, m, `🛒 *Pedagang Keliling* di ${area.name} menawarkan *${ITEMS[item].emoji} ${ITEMS[item].name}* seharga 💹 ${fmt(price)}.\nKamu membelinya!`, AGAIN);
		}
		return sendBtn(conn, m, `🛒 *Pedagang Keliling* menawarkan *${ITEMS[item].name}* seharga 💹 ${fmt(price)}, tapi uangmu kurang.`, AGAIN);
	}
	if (kind === 'hunter') {
		addItem(user, 'meat', 1);
		user.exp += 30;
		guildExp(user, 10);
		return sendBtn(conn, m, `🏹 Kamu menemukan *Pemburu Terluka* di ${area.name}. Kamu menolongnya dan dia memberimu *🍖 Daging* sebagai tanda terima kasih.\n✨ +30 XP`, AGAIN);
	}
	if (kind === 'sage') {
		useBuff(user, 'ramuan_kekuatan');
		return sendBtn(conn, m, `🧙 *Sage Misterius* muncul dari kabut dan memberimu berkah!\n🧪 Buff *ATK +20%* selama 4 giliran aktif.`, AGAIN);
	}
	const loot = rollLoot(user, {});
	const items = applyLoot(user, loot);
	user.money += loot.money;
	user.exp += loot.exp;
	return sendBtn(conn, m, `🗺️ Kamu menemukan *peta harta karun* di ${area.name} dan menggali hadiahnya!\n\n${items}${loot.money ? `\n💹 +${fmt(loot.money)} money` : ''}\n✨ +${loot.exp} XP`, AGAIN);
}

handler.help = ['explore'];
handler.tags = ['rpg'];
handler.command = /^(explore|jelajah)$/i;
handler.register = true;

export default handler;
