import * as gameState from '../lib/state.js';
import { areaById, pick, scaledMob, bossFor, startBattle, onCooldown, cdMs, BOSS_TAUNT, sendBtn, BTN } from '../lib/rpg.js';

const handler = async function (m, { command, args }) {
	const user = global.db.data.users[m.sender];
	if (!user.class) return m.reply('Pilih kelas dulu: .kelas');
	const area = areaById(user.area);
	if (user.level < area.min) return m.reply(`Level minimum untuk *${area.name}* adalah ${area.min}.`);
	const key = m.chat + ':' + m.sender;
	if (gameState.has('battle', key)) return m.reply('Kamu masih dalam battle.');
	const go = (args[0] || '').toLowerCase() === 'y';

	if (!go) {
		return sendBtn(
			this,
			m,
			`*PETUALANGAN DI ${area.name.toUpperCase()}*\n\n🏰 Dungeon: 5 stage menuju bos (cooldown 30 mnt, limit 2)\n👑 Bos: tantang bos area (cooldown 6 jam, limit 2)\n\nPilih:`,
			[BTN('🏰 Dungeon', '.dungeon y'), BTN('👑 Bos', '.boss y')]
		);
	}

	if (command === 'dungeon') {
		if (onCooldown(user, 'dungeon', cdMs(user, 30 * 60 * 1000), m, 'masuk dungeon')) return;
		const d = { stage: 1, total: 5, area: area.id };
		startBattle(this, m, user, scaledMob(pick(area.mobs), user.level), { area, source: 'dungeon', dungeon: d });
		return m.reply(`🏰 *DUNGEON ${area.name.toUpperCase()}*\n5 stage menuju bos. Siapkan diri!\n\n⚔️ *Stage 1/5*`);
	}

	if (command === 'boss') {
		if (onCooldown(user, 'boss', cdMs(user, 6 * 60 * 60 * 1000), m, 'tantang bos')) return;
		const taunt = BOSS_TAUNT[area.id] || 'Siapkan dirimu!';
		startBattle(this, m, user, bossFor(user), { area, source: 'boss', boss: true });
		return m.reply(`👑 *${area.boss.name}* muncul!\n\n${taunt}\n\n— Kalahkan dia untuk maju ke area berikutnya.`);
	}
};

handler.help = ['dungeon', 'boss'];
handler.tags = ['rpg'];
handler.command = /^(dungeon|boss)$/i;
handler.register = true;
handler.limit = 2;

export default handler;
