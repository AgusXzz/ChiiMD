const handler = async (m, { text, participants, groupMetadata, command }) => {
	const target = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;

	const cmd = ['add', 'kick', 'promote', 'demote'];

	if (cmd.includes(command) && !target) return m.reply('Reply/tag siapa yang ingin di proses.');

	const inGc = participants.some((v) => v.jid == target || v.id === target || v.phoneNumber === target);

	switch (command) {
		case 'add':
			{
				if (inGc) return m.reply('User sudah ada didalam grup!');
				const response = await conn.groupParticipantsUpdate(m.chat, [target], 'add');
				const jpegThumbnail = await conn.profilePictureUrl(m.chat, 'image', 'buffer');

				for (const participant of response) {
					const jid = participant.content.attrs.phone_number || participant.content.attrs.jid;
					const status = participant.status;

					if (status === '408') {
						m.reply(`Tidak dapat menambahkan @${jid.split('@')[0]}!\nMungkin @${jid.split('@')[0]} baru keluar dari grup ini atau dikick`);
					} else if (status === '403') {
						const inviteCode = participant.content.content[0].attrs.code;
						const inviteExp = participant.content.content[0].attrs.expiration;
						await m.reply(`Mengundang @${jid.split('@')[0]} menggunakan invite...`);

						await conn.sendGroupV4Invite(m.chat, jid, inviteCode, inviteExp, groupMetadata.subject, 'Undangan untuk bergabung ke grup WhatsApp saya', jpegThumbnail);
					}
				}
			}
			break;

		case 'kick':
			if (!inGc) return m.reply('User tidak ada dalam grup.');
			conn.groupParticipantsUpdate(m.chat, [target], 'remove');
			m.reply(`Berhasil kick: @${target.split('@')[0]}`);
			break;

		case 'promote':
			if (!inGc) return m.reply('User tidak berada dalam grup!');
			conn.groupParticipantsUpdate(m.chat, [target], 'promote');
			m.reply(`Promote: @${target.split('@')[0]}`);
			break;

		case 'demote':
			if (!inGc) return m.reply('User tidak berada dalam grup!');
			conn.groupParticipantsUpdate(m.chat, [target], 'demote');
			m.reply(`Demote: @${target.split('@')[0]}`);
			break;

		case 'closegc':
		case 'mute':
			conn.groupSettingUpdate(m.chat, 'announcement');
			m.reply('Grup berhasil ditutup (hanya admin yang bisa chat).');
			break;

		case 'opengc':
		case 'unmute':
			conn.groupSettingUpdate(m.chat, 'not_announcement');
			m.reply('Grup berhasil dibuka (semua member bisa chat).');
			break;

		default:
			return m.reply('Perintah tidak dikenal.');
	}
};

handler.help = ['add', 'kick', 'promote', 'demote', 'opengc', 'closegc'];
handler.tags = ['group'];
handler.command = /^(add|kick|promote|demote|mute|unmute|opengc|closegc)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
