export function before(m, { conn }) {
	const user = global.db.data.users[m.sender];
	if (user?.afk > -1) {
		m.reply(
			`
${conn.getName(m.sender)} berhenti AFK${user.afkReason ? ' setelah ' + user.afkReason : ''}
Selama ${(new Date() - user.afk).toTimeString()}
  `.trim()
		);
		user.afk = -1;
		user.afkReason = '';
	}
	const jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];
	for (const jid of jids) {
		const user = global.db.data.users[jid];
		if (!user) continue;
		const afkTime = user.afk;
		if (!afkTime || afkTime < 0) continue;
		const reason = user.afkReason;
		m.reply(
			`
${conn.getName(m.sender)} Jangan tag dia!
Dia sedang AFK ${reason ? 'dengan alasan ' + reason : 'tanpa alasan'}
Selama ${(new Date() - afkTime).toTimeString()}
  `.trim()
		);
	}
	return true;
}
