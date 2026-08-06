import { guild, guildLevel, onCooldown, fmt, sendBtn, BTN } from '../lib/rpg.js';

let handler = async function (m, { args }) {
	const user = global.db.data.users[m.sender];
	const g = guild(user);
	const sub = (args[0] || '').toLowerCase();

	if (!sub) {
		if (!g) return sendBtn(this, m, 'Kamu belum masuk guild.\n\n.guild create <nama>\n.guild join <kode>', [BTN('🏰 Buat Guild', '.guild create')]);
		const coLead = (g.coLead || []).map((j) => `@${j.split('@')[0]}`).join(', ');
		return sendBtn(
			this,
			m,
			`🏰 *${g.name}*\nKode: ${g.code}\nLevel: ${guildLevel(g)} (${fmt(g.exp)} XP)\nOwner: @${g.owner.split('@')[0]}${coLead ? `\nCo-Leader: ${coLead}` : ''}\nBank: 🏦 ${fmt(g.bank)}\nMember: ${(g.members || []).length}/50\n\n${g.desc || ''}`,
			[BTN('🏦 Bank', '.guild bank'), BTN('🚪 Keluar', '.guild leave'), BTN('📝 Deskripsi', '.guild desc')]
		);
	}

	if (sub === 'create') {
		if (g) return m.reply('Kamu sudah di guild.');
		const name = args.slice(1).join(' ').trim();
		if (name.length < 2 || name.length > 20) return m.reply('Nama guild 2-20 karakter.');
		if (user.money < 50000) return m.reply(`Biaya buat guild 💹 50.000.`);
		user.money -= 50000;
		const code = Math.random().toString(36).slice(2, 8).toUpperCase();
		const gid = 'g' + Date.now();
		global.db.data.guilds[gid] = { name, code, owner: m.sender, coLead: [], members: [m.sender], exp: 0, bank: 0, desc: '', at: Date.now() };
		user.guild = gid;
		return m.reply(`🏰 Guild *${name}* dibuat!\nKode undangan: *${code}*`);
	}

	if (sub === 'join') {
		const code = (args[1] || '').toUpperCase();
		if (!code) return m.reply('Format: .guild join <kode>');
		const entry = Object.entries(global.db.data.guilds).find(([, x]) => x.code === code);
		if (!entry) return m.reply('Kode tidak ditemukan.');
		const [, target] = entry;
		if (g) return m.reply('Kamu sudah di guild.');
		if ((target.members || []).length >= 50) return m.reply('Guild penuh.');
		if (onCooldown(user, 'guildJoin', 3600 * 1000, m, 'gabung guild')) return;
		target.members.push(m.sender);
		user.guild = entry[0];
		return m.reply(`✅ Gabung ke *${target.name}*!`);
	}

	if (sub === 'leave') {
		if (!g) return m.reply('Kamu tidak di guild.');
		if (g.owner === m.sender) return m.reply('Owner tidak bisa keluar. Gunakan .guild disband');
		g.members = g.members.filter((x) => x !== m.sender);
		user.guild = null;
		return m.reply('Kamu keluar dari guild.');
	}

	if (sub === 'disband') {
		if (!g) return m.reply('Kamu tidak di guild.');
		if (g.owner !== m.sender) return m.reply('Hanya owner.');
		for (const j of g.members) if (global.db.data.users[j]) global.db.data.users[j].guild = null;
		delete global.db.data.guilds[user.guild];
		user.guild = null;
		return m.reply('🏚️ Guild dibubarkan.');
	}

	if (sub === 'kick') {
		if (!g) return m.reply('Kamu tidak di guild.');
		if (g.owner !== m.sender && !g.coLead.includes(m.sender)) return m.reply('Hanya owner/co-leader.');
		const target = m.quoted ? m.quoted.sender : m.mentionedJid[0];
		if (!target || !g.members.includes(target)) return m.reply('Target bukan member.');
		g.members = g.members.filter((x) => x !== target);
		global.db.data.users[target].guild = null;
		return m.reply('Member dikeluarkan.');
	}

	if (sub === 'lead') {
		if (!g || g.owner !== m.sender) return m.reply('Hanya owner.');
		const target = m.quoted ? m.quoted.sender : m.mentionedJid[0];
		if (!target || target === g.owner || !g.members.includes(target)) return m.reply('Target tidak valid.');
		if (g.coLead.includes(target)) {
			g.coLead = g.coLead.filter((x) => x !== target);
			return m.reply('Co-leader dicabut.');
		}
		if (g.coLead.length >= 2) return m.reply('Maksimal 2 co-leader.');
		g.coLead.push(target);
		return m.reply('Co-leader ditunjuk.');
	}

	if (sub === 'transfer') {
		if (!g || g.owner !== m.sender) return m.reply('Hanya owner.');
		const target = m.quoted ? m.quoted.sender : m.mentionedJid[0];
		if (!target || target === g.owner || !g.members.includes(target)) return m.reply('Target harus member guild.');
		g.owner = target;
		g.coLead = (g.coLead || []).filter((x) => x !== target);
		return m.reply(`👑 Owner guild dipindahkan ke @${target.split('@')[0]}.`);
	}

	if (sub === 'desc') {
		if (!g || (g.owner !== m.sender && !g.coLead.includes(m.sender))) return m.reply('Hanya owner/co-leader.');
		g.desc = args.slice(1).join(' ').slice(0, 200);
		return m.reply('Deskripsi guild diperbarui.');
	}

	if (sub === 'bank') {
		if (!g) return m.reply('Kamu tidak di guild.');
		const amt = parseInt(args[2]) || 0;
		if (args[1] === 'deposit') {
			if (amt <= 0 || user.money < amt) return m.reply('Jumlah tidak valid.');
			user.money -= amt;
			g.bank += amt;
			return m.reply(`💳 Deposit guild 💹 ${fmt(amt)}.`);
		}
		if (args[1] === 'withdraw') {
			if (g.owner !== m.sender && !g.coLead.includes(m.sender)) return m.reply('Hanya owner/co-leader.');
			if (amt <= 0 || g.bank < amt) return m.reply('Jumlah tidak valid.');
			g.bank -= amt;
			user.money += amt;
			return m.reply(`💳 Withdraw guild 💹 ${fmt(amt)}.`);
		}
		return m.reply(`🏦 Bank guild: ${fmt(g.bank)}`);
	}

	return m.reply('Sub-perintah: create/join/leave/disband/kick/lead/transfer/desc/bank');
};

handler.help = ['guild'];
handler.tags = ['guild'];
handler.command = ['guild'];
handler.register = true;

export default handler;
