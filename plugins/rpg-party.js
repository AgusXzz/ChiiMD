import * as gameState from '../lib/state.js';
import { areaById, pick, scaledMob, sendBtn, battleButtons, partyBattleText, BTN } from '../lib/rpg.js';

const handler = async function (m, { args }) {
	if (!m.isGroup) return m.reply('Party hanya bisa dibuat di grup.');
	const party = gameState.get('party', m.chat);
	const user = global.db.data.users[m.sender];
	const sub = (args[0] || '').toLowerCase();

	if (!sub) {
		if (!party) {
			return sendBtn(this, m, 'Belum ada party di grup ini.', [BTN('⚔️ Buat Party', '.party create'), BTN('🫂 Gabung', '.party join')]);
		}
		const list = party.members.map((j) => `@${j.split('@')[0]}${j === party.leader ? ' 👑' : ''}`).join('\n');
		return sendBtn(this, m, `⚔️ *PARTY* (${party.members.length}/4)\nLeader: @${party.leader.split('@')[0]}\n\n${list}`, [
			BTN('⚔️ Battle', '.party battle'),
			BTN('🫂 Gabung', '.party join'),
			BTN('🚪 Keluar', '.party leave'),
		]);
	}

	if (sub === 'create') {
		if (party) return m.reply('Sudah ada party.');
		gameState.set('party', m.chat, { leader: m.sender, members: [m.sender] });
		return m.reply('⚔️ Party dibuat! Anggota lain: .party join');
	}

	if (sub === 'join') {
		if (!party) return m.reply('Belum ada party.');
		if (party.members.includes(m.sender)) return m.reply('Sudah di party.');
		if (party.members.length >= 4) return m.reply('Party penuh (maks 4).');
		party.members.push(m.sender);
		return m.reply('✅ Masuk party.');
	}

	if (sub === 'leave') {
		if (!party || !party.members.includes(m.sender)) return m.reply('Kamu tidak di party.');
		party.members = party.members.filter((x) => x !== m.sender);
		if (party.leader === m.sender && party.members.length) party.leader = party.members[0];
		if (!party.members.length) gameState.del('party', m.chat);
		return m.reply('Keluar dari party.');
	}

	if (sub === 'disband') {
		if (!party || party.leader !== m.sender) return m.reply('Hanya leader.');
		gameState.del('party', m.chat);
		return m.reply('Party dibubarkan.');
	}

	if (sub === 'battle') {
		if (!party) return m.reply('Belum ada party.');
		if (!party.members.includes(m.sender)) return m.reply('Kamu bukan member party.');
		if (!user.class) return m.reply('Pilih kelas dulu: .kelas');
		if (gameState.has('battle', m.chat + ':party')) return m.reply('Party sedang bertarung.');
		const area = areaById(user.area);
		const mob = scaledMob(pick(area.mobs), user.level + party.members.length * 2);
		mob.hp = Math.round(mob.hp * (1 + (party.members.length - 1) * 0.8));
		mob.exp = Math.round(mob.exp * (1 + (party.members.length - 1) * 0.5));
		mob.money = Math.round(mob.money * (1 + (party.members.length - 1) * 0.5));
		const pstate = { party: true, chat: m.chat, members: [...party.members], turn: 0, monster: mob, area, skillCd: 0, defending: false };
		gameState.set('battle', m.chat + ':party', pstate);
		return sendBtn(this, m, partyBattleText(pstate), battleButtons(pstate, user));
	}

	return m.reply('Sub-perintah: create/join/leave/disband/battle');
};

handler.help = ['party'];
handler.tags = ['rpg'];
handler.command = ['party'];
handler.register = true;

export default handler;
