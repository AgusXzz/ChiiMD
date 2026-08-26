import { eventState, eventText, getStats, attack, onCooldown, addItem, grantAchievements, fmt, sendBtn, BTN } from '../lib/rpg.js';

const handler = async function (m, { args }) {
	const user = global.db.data.users[m.sender];
	const sub = (args[0] || '').toLowerCase();
	const ev = eventState(this);

	if (!sub || sub === 'info') {
		return ev.active ? sendBtn(this, m, eventText(ev), [BTN('⚔️ Serang', '.invasi attack')]) : m.reply(eventText(ev));
	}
	if (sub !== 'attack') return m.reply('Sub-perintah: info / attack');

	if (!ev.active) return m.reply(eventText(ev));
	if (onCooldown(user, 'invasi', 60 * 1000, m, 'menyerang invasi')) return;

	const s = getStats(user);
	const dmg = Math.max(1, Math.round(s.atk * (1.2 + Math.random() * 0.6)));
	ev.hp -= dmg;
	ev.dmg[m.sender] = (ev.dmg[m.sender] || 0) + dmg;

	let txt = `⚔️ Kamu menyerang ${ev.boss.emoji} ${ev.boss.name}!\n-${dmg} DMG`;

	if (ev.hp <= 0) {
		// boss mati → reward peserta
		const entries = Object.entries(ev.dmg);
		const total = entries.reduce((n, [, d]) => n + d, 0) || 1;
		let rewardTxt = `\n\n💥 *${ev.boss.name} TERTAKLUK!*\n\n`;
		for (const [jid, dmgDealt] of entries) {
			const u = global.db.data.users[jid];
			if (!u) continue;
			const share = Math.round(100000 * (dmgDealt / total));
			u.money += share;
			if (Math.random() < 0.4) {
				addItem(u, 'kristal_iblis', 1);
				rewardTxt += `@${jid.split('@')[0]}: 💹 +${fmt(share)} ${Math.random() < 0.5 ? '| 🔮 Kristal Iblis' : ''}\n`;
			} else rewardTxt += `@${jid.split('@')[0]}: 💹 +${fmt(share)}\n`;
		}
		if (!entries.length) rewardTxt += 'Tidak ada peserta...';
		ev.active = false;
		ev.hp = 0;
		ev.next = Date.now() + 3 * 3600 * 1000;
		ev.dmg = {};
		rewardTxt += `\n\n⏳ Invasi berikutnya dalam 3 jam.`;
		grantAchievements(user);
		return m.reply(txt + rewardTxt);
	}

	const monAtk = attack(ev.boss.atk, s.def, 10);
	if (!monAtk.miss) {
		user.hp -= monAtk.dmg;
		txt += `\n${ev.boss.emoji} ${ev.boss.name} membalas! -${monAtk.dmg} HP.`;
	}
	txt += `\n\n💀 Boss: ${Math.max(0, ev.hp)}/${ev.maxHp} HP\n📊 Damage-mu: ${ev.dmg[m.sender]}`;
	return m.reply(txt);
};

handler.help = ['invasi'];
handler.tags = ['rpg'];
handler.command = ['invasi'];
handler.register = true;

export default handler;
