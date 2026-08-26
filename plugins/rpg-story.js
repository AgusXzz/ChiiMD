import { CHAPTERS, storyFor, hasItem, removeItem, addItem, fmt, itemLabel, sendBtn, BTN } from '../lib/rpg.js';

const handler = async function (m, { args }) {
	const user = global.db.data.users[m.sender];
	const sub = (args[0] || '').toLowerCase();
	const c = storyFor(user);
	const st = user.story || (user.story = { chapter: 1, kills: 0, done: [] });

	if (!sub || sub === 'info') {
		const needs = c.needs
			.map(([id, q], i) => `• ${itemLabel(id)} x${q} ${st.done.includes(i) ? '✅' : `(${Math.min(hasItem(user, id) ? (user.inventory[id] > q ? q : user.inventory[id]) : 0, q)}/${q})`}`)
			.join('\n');
		const bossStatus = st.bossDone ? '✅' : '❌';
		return sendBtn(
			this,
			m,
			`📖 *BAB ${c.id}: ${c.title}*\n\n${c.intro}\n\n*Objektif:*\n${needs}\n• Kalahkan ${c.kills} monster (${Math.min(st.kills || 0, c.kills)}/${c.kills})\n• Kalahkan bos ${bossStatus}`,
			[BTN('📌 Lanjut', '.story next'), BTN('🗡️ Info Bos', '.story boss'), BTN('✅ Klaim', '.story complete')]
		);
	}

	if (sub === 'next') {
		if (st.bossDone) return m.reply('Bos sudah dikalahkan. Klaim hadiah: .story complete');
		const claim = [];
		c.needs.forEach(([id, q], i) => {
			if (st.done.includes(i)) return;
			if (hasItem(user, id, q)) {
				removeItem(user, id, q);
				st.done.push(i);
				claim.push(`${itemLabel(id)} x${q}`);
			}
		});
		if (!claim.length) return m.reply('Belum ada objektif yang bisa diklaim. Kumpulkan bahan dulu (lihat .story info).');
		return m.reply(`📦 Objektif terpenuhi:\n${claim.join('\n')}\n\nLanjutkan dengan mengalahkan bos: .boss (atau dungeon).`);
	}

	if (sub === 'boss') {
		return m.reply(
			`🗡️ *BOS BAB ${c.id}*\n\n${c.intro}\n\nKalahkan bos area *${c.area}* lewat \`.boss\` atau stage terakhir \`.dungeon\`.\n\nSyarat bab terpenuhi? ${st.done.length === c.needs.length && (st.kills || 0) >= c.kills ? '✅' : '❌'}`
		);
	}

	if (sub === 'complete') {
		if (!st.bossDone) return m.reply('Kalahkan bos bab ini dulu: .boss');
		if (st.done.length !== c.needs.length) return m.reply('Klaim semua objektif dulu: .story next');
		if ((st.kills || 0) < c.kills) return m.reply(`Masih kurang ${c.kills - (st.kills || 0)} kill lagi.`);
		if ((user.level || 1) < c.level) return m.reply(`Butuh level ${c.level} untuk bab ini.`);

		const r = c.reward;
		if (r.title) {
			user.title = user.title === r.title ? user.title : r.title;
		}
		if (r.item) addItem(user, r.item);
		if (r.pet && !user.pet) user.pet = { id: r.pet, lvl: 1, exp: 0 };
		if (r.money) user.money += r.money;
		if (r.exp) user.exp += r.exp;

		const next = CHAPTERS[c.id];
		let txt = `🎉 *BAB ${c.id} SELESAI!*\n\n${r.title ? `🏅 Gelar: *${r.title}*\n` : ''}${r.item ? `🎁 ${itemLabel(r.item)}\n` : ''}${r.pet ? `🐾 Pet: ${itemLabel(r.pet)}\n` : ''}${r.money ? `💹 +${fmt(r.money)} money\n` : ''}${r.exp ? `✨ +${fmt(r.exp)} XP\n` : ''}`;
		if (next) {
			st.chapter = next.id;
			st.kills = 0;
			st.done = [];
			delete st.bossDone;
			txt += `\n📖 *Bab ${next.id} terbuka: ${next.title}*\n\n${next.intro}`;
		} else {
			txt += '\n\n👑 Kamu telah menaklukkan dunia Atheria. Gelar *Pahlawan Atheria* milikmu selamanya!';
		}
		return m.reply(txt);
	}

	return m.reply('Sub-perintah: info/next/boss/complete');
};

handler.help = ['story'];
handler.tags = ['rpg'];
handler.command = ['story'];
handler.register = true;

export default handler;
