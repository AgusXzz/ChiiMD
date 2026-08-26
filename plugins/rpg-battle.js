import {
	CLASSES,
	getStats,
	attack,
	sendBtn,
	battleText,
	battleButtons,
	partyBattleText,
	duelText,
	duelBtns,
	rollLoot,
	applyLoot,
	addItem,
	hasItem,
	removeItem,
	guildExp,
	guildPerk,
	premiumPerk,
	questTrack,
	areaById,
	scaledMob,
	pick,
	startBattle,
	bossFor,
	clearArea,
	fmt,
	traitsOf,
	activeBuff,
	consumeTurns,
	storyKill,
	storyBossDone,
	grantAchievements,
} from '../lib/rpg.js';

// ============ SOLO ============

async function soloAction(conn, m, user, state, command) {
	const key = m.chat + ':' + m.sender;
	const { monster, cls } = state;
	const s = getStats(user);
	const traits = traitsOf(user);
	const lines = [];
	const fled = false;

	if (traits.has('regen')) {
		const heal = Math.round(s.maxHp * 0.03);
		user.hp = Math.min(s.maxHp, user.hp + heal);
		lines.push('♻️ +' + heal + ' HP (regen).');
	}
	const deal = (dmg) => {
		monster.hp -= dmg;
		if (traits.has('lifesteal')) {
			const heal = Math.round(dmg * 0.2);
			user.hp = Math.min(s.maxHp, user.hp + heal);
			lines.push(`🩸 Lifesteal +${heal} HP.`);
		}
	};

	if (command === 'flee') {
		if (Math.random() < 0.6) {
			conn.battles.delete(key);
			return m.reply('🏃 Kamu berhasil kabur!');
		}
		lines.push('🏃 Gagal kabur!');
	} else if (command === 'heal') {
		if (!hasItem(user, 'potion')) return m.reply('Kamu tidak punya Potion.');
		if (user.hp >= s.maxHp) return m.reply('HP sudah penuh.');
		removeItem(user, 'potion');
		user.hp = Math.min(s.maxHp, user.hp + 60);
		lines.push('🧪 HP pulih!');
	} else if (command === 'attack') {
		const r = attack(s.atk, monster.def, s.crit);
		if (r.miss) lines.push('💨 Seranganmu meleset!');
		else {
			deal(r.dmg);
			lines.push(`${r.crit ? '💥 *CRITICAL!* ' : ''}-${r.dmg} DMG ke ${monster.emoji} ${monster.name}.`);
		}
	} else if (command === 'skill') {
		if (state.skillCd > 0) return m.reply(`Skill cooldown ${state.skillCd} giliran lagi.`);
		if (user.mana < cls.skill.cost) return m.reply('MP tidak cukup.');
		user.mana -= cls.skill.cost;
		state.skillCd = 3;
		const r = attack(s.atk * cls.skill.power, cls.skill.magic ? 0 : monster.def, s.crit);
		if (r.miss) lines.push('💨 Skill meleset!');
		else {
			deal(r.dmg);
			lines.push(`${cls.skill.emoji} *${cls.skill.name}*! ${r.crit ? '💥 CRITICAL! ' : ''}-${r.dmg} DMG.`);
		}
	} else if (command === 'defend') {
		state.defending = true;
		lines.push('🛡️ Kamu bersiap bertahan.');
	}

	if (monster.hp > 0 && command !== 'flee' && !fled) {
		let ma = attack(monster.atk, state.defending ? s.def * 2 : s.def, 8);
		if (traits.has('dodge') && Math.random() < 0.15) {
			lines.push('💨 Terhindar (dodge)!');
			ma = { miss: true };
		}
		if (ma.miss) lines.push('💨 Monster meleset!');
		else {
			user.hp -= ma.dmg;
			lines.push(`${monster.emoji} ${monster.name} menyerang! -${ma.dmg} HP.`);
			if (traits.has('thorns')) {
				const ref = Math.round(ma.dmg * 0.15);
				monster.hp -= ref;
				lines.push(`🛡️ Thorns memantulkan ${ref} DMG!`);
			}
		}
		state.defending = false;
	}
	state.turns++;
	if (state.skillCd > 0) state.skillCd--;
	consumeTurns(user, 1);

	if (monster.hp <= 0) return winSolo(conn, m, user, state);
	if (user.hp <= 0) return loseSolo(conn, m, user, state, lines);

	return sendBtn(conn, m, battleText(state, user) + '\n\n' + lines.join('\n'), battleButtons(state, user));
}

function winSolo(conn, m, user, state) {
	const key = m.chat + ':' + m.sender;
	conn.battles.delete(key);
	user.wins++;
	user.kills++;
	const loot = rollLoot(user, { boss: state.boss, dungeon: !!state.dungeon });
	const traits = traitsOf(user);
	const perk = guildPerk(user) * premiumPerk(user) * (activeBuff(user).xp ? 1 + activeBuff(user).xp.pct / 100 : 1);
	const goldMult = traits.has('goldFind') ? 1.2 : 1;
	user.exp += Math.round((loot.exp + Math.round(loot.exp * (perk - 1))) * (traits.has('xpBoost') ? 1.2 : 1));
	user.money += Math.round((loot.money + Math.round(loot.money * (perk - 1))) * goldMult);
	guildExp(user, 15);
	questTrack(user, 'kills', 1);
	storyKill(user, state.area?.id);
	const s = getStats(user);
	user.hp = Math.min(s.maxHp, user.hp + Math.round(s.maxHp * 0.2));

	let extra = '';
	if (state.boss) {
		user.bossKills++;
		storyBossDone(user, state.area?.id);
		const next = clearArea(user);
		extra = next ? `\n\n🗺️ Area terbuka: *${next.name}*!` : '\n\n🏆 Kamu mengalahkan iblis terakhir!';
	}
	if (state.dungeon) {
		const d = state.dungeon;
		if (d.stage < d.total) {
			d.stage++;
			user.hp = Math.min(s.maxHp, user.hp + Math.round(s.maxHp * 0.3));
			user.mana = s.maxMana;
			const area = areaById(d.area);
			const mob = d.stage === d.total ? bossFor(user) : scaledMob(pick(area.mobs), user.level);
			startBattle(conn, m, user, mob, { area, source: 'dungeon', dungeon: d, boss: d.stage === d.total });
			return m.reply(`🎉 *Stage ${d.stage - 1}/${d.total} bersih!*\n✨ +${loot.exp} XP | 💹 +${fmt(loot.money)} money\n\n⚔️ Lanjut ke stage ${d.stage}...`);
		}
		questTrack(user, 'dungeons', 1);
		user.count = user.count || {};
		user.count.dungeon = (user.count.dungeon || 0) + 1;
		extra += '\n\n🏰 Dungeon berhasil ditaklukkan!';
	}
	grantAchievements(user);

	return m.reply(`🎉 *Menang!* Kamu mengalahkan ${state.monster.emoji} ${state.monster.name}.\n✨ +${loot.exp} XP | 💹 +${fmt(loot.money)} money\n\n${applyLoot(user, loot)}${extra}`);
}

function loseSolo(conn, m, user, state, lines) {
	const key = m.chat + ':' + m.sender;
	conn.battles.delete(key);
	user.deaths++;
	user.losses++;
	const lose = Math.min(user.money, Math.round((10 + user.level * 3) * 0.5));
	user.money -= lose;
	user.hp = 1;
	return m.reply(`💀 *Kalah!* ${state.monster.emoji} ${state.monster.name} mengalahkanmu.\n${lines.join('\n')}\n\n-${fmt(lose)} money hilang. HP tersisa 1. Gunakan \`.heal\` atau potion.`);
}

async function healOutside(conn, m, user) {
	if (!hasItem(user, 'potion')) return m.reply('Kamu tidak punya Potion.');
	const s = getStats(user);
	if (user.hp >= s.maxHp) return m.reply('HP sudah penuh.');
	removeItem(user, 'potion');
	user.hp = Math.min(s.maxHp, user.hp + 60);
	return m.reply(`🧪 HP pulih ke ${user.hp}/${s.maxHp}.`);
}

// ============ PARTY ============

async function partyAction(conn, m, user, state, command) {
	const key = m.chat + ':party';
	if (!state.members.includes(m.sender)) return;
	const idx = state.turn % state.members.length;
	const actor = state.members[idx];
	if (m.sender !== actor) return m.reply(`Sekarang giliran @${actor.split('@')[0]}.`);
	const aUser = global.db.data.users[actor];
	const s = getStats(aUser);
	const cls = CLASSES[aUser.class];
	const traits = traitsOf(aUser);
	const { monster } = state;
	const lines = [];
	const deal = (dmg) => {
		monster.hp -= dmg;
		if (traits.has('lifesteal')) {
			const heal = Math.round(dmg * 0.2);
			aUser.hp = Math.min(s.maxHp, aUser.hp + heal);
			lines.push(`🩸 Lifesteal +${heal} HP.`);
		}
	};

	if (command === 'flee') {
		if (Math.random() < 0.4) {
			conn.battles.delete(key);
			return m.reply('🏃 Party mundur dari pertempuran!');
		}
		lines.push('🏃 Gagal kabur!');
	} else if (command === 'heal') {
		if (!hasItem(aUser, 'potion')) return m.reply('Tidak punya Potion.');
		removeItem(aUser, 'potion');
		aUser.hp = Math.min(s.maxHp, aUser.hp + 60);
		lines.push('🧪 HP pulih!');
	} else if (command === 'attack') {
		const r = attack(s.atk, monster.def, s.crit);
		if (r.miss) lines.push('💨 Serangan meleset!');
		else {
			deal(r.dmg);
			lines.push(`${r.crit ? '💥 CRITICAL! ' : ''}-${r.dmg} DMG ke ${monster.name}.`);
		}
	} else if (command === 'skill') {
		if (state.skillCd > 0) return m.reply('Skill cooldown.');
		if (aUser.mana < cls.skill.cost) return m.reply('MP tidak cukup.');
		aUser.mana -= cls.skill.cost;
		state.skillCd = 3;
		const r = attack(s.atk * cls.skill.power, cls.skill.magic ? 0 : monster.def, s.crit);
		if (r.miss) lines.push('💨 Skill meleset!');
		else {
			deal(r.dmg);
			lines.push(`${cls.skill.emoji} *${cls.skill.name}*! ${r.crit ? '💥 ' : ''}-${r.dmg} DMG.`);
		}
	} else if (command === 'defend') {
		state.defending = true;
		lines.push('🛡️ Bertahan.');
	}

	if (monster.hp > 0 && command !== 'flee') {
		let ma = attack(monster.atk, state.defending ? s.def * 2 : s.def, 8);
		if (traits.has('dodge') && Math.random() < 0.15) {
			lines.push('💨 Terhindar (dodge)!');
			ma = { miss: true };
		}
		if (ma.miss) lines.push('💨 Monster meleset!');
		else {
			aUser.hp -= ma.dmg;
			lines.push(`${monster.emoji} ${monster.name} menyerang @${actor.split('@')[0]}! -${ma.dmg} HP.`);
			if (traits.has('thorns')) {
				const ref = Math.round(ma.dmg * 0.15);
				monster.hp -= ref;
				lines.push(`🛡️ Thorns memantulkan ${ref} DMG!`);
			}
		}
		state.defending = false;
	}
	if (state.skillCd > 0) state.skillCd--;
	consumeTurns(aUser, 1);

	if (monster.hp <= 0) {
		conn.battles.delete(key);
		const alive = state.members.filter((j) => (global.db.data.users[j].hp || 0) > 0);
		const loot = rollLoot(user, {});
		const exp = Math.round(loot.exp / alive.length);
		const money = Math.round(loot.money / alive.length);
		let txt = '🎉 *Party menang!*\n';
		for (const j of alive) {
			const u = global.db.data.users[j];
			u.wins++;
			u.kills++;
			u.count = u.count || {};
			u.count.party = (u.count.party || 0) + 1;
			u.exp += Math.round(exp * premiumPerk(u));
			u.money += Math.round(money * premiumPerk(u));
			for (const [id, q] of loot.items) addItem(u, id, q);
			guildExp(u, 10);
			questTrack(u, 'kills', 1);
			storyKill(u, state.area?.id);
			grantAchievements(u);
			u.hp = Math.min(getStats(u).maxHp, u.hp + Math.round(getStats(u).maxHp * 0.2));
			txt += `\n@${j.split('@')[0]}: ✨ +${exp} XP | 💹 +${fmt(money)}`;
		}
		txt += `\n\n${applyLoot(user, loot)}`;
		return m.reply(txt);
	}
	if (state.members.every((j) => (global.db.data.users[j].hp || 0) <= 0)) {
		conn.battles.delete(key);
		for (const j of state.members) {
			const u = global.db.data.users[j];
			u.deaths++;
			u.losses++;
			u.hp = 1;
		}
		return m.reply('💀 *Party kalah!* Semua anggota tumbang.');
	}

	state.turn++;
	let n = state.members.length;
	while (n-- > 0) {
		const a = state.members[state.turn % state.members.length];
		if ((global.db.data.users[a].hp || 0) > 0) break;
		state.turn++;
	}
	return sendBtn(conn, m, partyBattleText(state) + '\n\n' + lines.join('\n'), battleButtons(state, aUser));
}

// ============ DUEL ============

async function duelAction(conn, m, user, state, command) {
	const side = state.turn;
	if (m.sender !== state[side]) return m.reply('Sekarang giliran lawanmu.');
	const me = state[side];
	const opp = state[side === 'a' ? 'b' : 'a'];
	const meUser = global.db.data.users[me];
	const oppUser = global.db.data.users[opp];
	const sMe = getStats(meUser);
	const sOpp = getStats(oppUser);
	const cls = CLASSES[meUser.class];
	const lines = [];
	const defKey = side === 'a' ? 'bDef' : 'aDef';

	if (command === 'flee') return endDuel(conn, m, state, opp);
	if (command === 'attack') {
		const r = attack(sMe.atk, sOpp.def, sMe.crit);
		if (r.miss) lines.push('💨 Serangan meleset!');
		else {
			let dmg = r.dmg;
			if (state[defKey]) {
				dmg = Math.round(dmg / 2);
				state[defKey] = 0;
				lines.push('🛡️ Diredam pertahanan lawan!');
			}
			oppUser.hp -= dmg;
			lines.push(`${r.crit ? '💥 CRITICAL! ' : ''}-${dmg} DMG ke lawan!`);
		}
	} else if (command === 'skill') {
		const cdKey = side === 'a' ? 'aCd' : 'bCd';
		if (state[cdKey] > 0) return m.reply('Skill cooldown.');
		if (meUser.mana < cls.skill.cost) return m.reply('MP tidak cukup.');
		meUser.mana -= cls.skill.cost;
		state[cdKey] = 3;
		const r = attack(sMe.atk * cls.skill.power, cls.skill.magic ? 0 : sOpp.def, sMe.crit);
		if (r.miss) lines.push('💨 Skill meleset!');
		else {
			let dmg = r.dmg;
			if (state[defKey]) {
				dmg = Math.round(dmg / 2);
				state[defKey] = 0;
				lines.push('🛡️ Diredam pertahanan lawan!');
			}
			oppUser.hp -= dmg;
			lines.push(`${cls.skill.emoji} *${cls.skill.name}*! ${r.crit ? '💥 ' : ''}-${dmg} DMG.`);
		}
	} else if (command === 'defend') {
		state[side === 'a' ? 'aDef' : 'bDef'] = 1;
		lines.push('🛡️ Bersiap bertahan.');
	} else if (command === 'heal') {
		if (!hasItem(meUser, 'potion')) return m.reply('Tidak punya Potion.');
		removeItem(meUser, 'potion');
		meUser.hp = Math.min(sMe.maxHp, meUser.hp + 60);
		lines.push('🧪 HP pulih!');
	}

	if (state.aCd > 0) state.aCd--;
	if (state.bCd > 0) state.bCd--;
	consumeTurns(meUser, 1);
	consumeTurns(oppUser, 1);

	if (oppUser.hp <= 0) return endDuel(conn, m, state, me);
	state.turn = state.turn === 'a' ? 'b' : 'a';
	if (meUser.hp <= 0) return endDuel(conn, m, state, opp);

	return sendBtn(conn, m, duelText(state, global.db.data.users[state.a], global.db.data.users[state.b]) + '\n\n' + lines.join('\n'), duelBtns());
}

function endDuel(conn, m, state, winner) {
	const loser = winner === state.a ? state.b : state.a;
	const w = global.db.data.users[winner];
	const l = global.db.data.users[loser];
	w.wins++;
	l.losses++;
	l.deaths++;
	l.hp = 1;
	let txt = `⚔️ *DUEL SELESAI*\n\n🏆 @${winner.split('@')[0]} menang!`;
	if (state.bet) {
		w.money += state.bet * 2;
		txt += `\n💹 Menerima 💹 ${fmt(state.bet * 2)}`;
	}
	const traits = traitsOf(w);
	const loot = rollLoot(w, {});
	w.exp += Math.round(loot.exp * premiumPerk(w) * (traits.has('xpBoost') ? 1.2 : 1) * (activeBuff(w).xp ? 1 + activeBuff(w).xp.pct / 100 : 1));
	w.money += Math.round(loot.money * (traits.has('goldFind') ? 1.2 : 1));
	grantAchievements(w);
	w.hp = getStats(w).maxHp;
	w.mana = getStats(w).maxMana;
	conn.duels.delete(state.a);
	conn.duels.delete(state.b);
	return m.reply(txt);
}

// ============ MAIN ============

const handler = async function (m, { command }) {
	const user = global.db.data.users[m.sender];
	const batt = this.battles || (this.battles = new Map());
	const partyKey = m.chat + ':party';
	if (batt.has(partyKey)) return partyAction(this, m, user, batt.get(partyKey), command);
	const duel = (this.duels || (this.duels = new Map())).get(m.sender);
	if (duel) return duelAction(this, m, user, duel, command);
	const key = m.chat + ':' + m.sender;
	if (batt.has(key)) return soloAction(this, m, user, batt.get(key), command);
	if (command === 'heal') return healOutside(this, m, user);
	return m.reply('Kamu tidak sedang bertarung.');
};

handler.help = ['attack', 'skill', 'defend', 'heal', 'flee'];
handler.tags = ['rpg'];
handler.command = /^(attack|skill|defend|heal|flee|serang|lari)$/i;
handler.register = true;

export default handler;
