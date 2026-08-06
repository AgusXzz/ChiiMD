import { delay } from 'baileys';

let handler = async (m, { text }) => {
	if (!text) return m.reply('Kirim: .broadcast <pesan>\nMode: .broadcast group/user/owner <pesan>');
	let mode = 'group';
	let msg = text;
	const first = text.split(/\s+/)[0].toLowerCase();
	if (['group', 'user', 'owner', 'gc', 'pc'].includes(first)) {
		mode = first === 'pc' ? 'user' : first;
		msg = text.slice(first.length).trim();
	}
	if (!msg) return m.reply('Pesan kosong.');

	let targets = [];
	if (mode === 'user') targets = Object.keys(global.db.data.users).filter((j) => j.endsWith('@s.whatsapp.net'));
	else if (mode === 'owner') targets = global.owner.map(([n]) => n + '@s.whatsapp.net');
	else targets = Object.keys((await conn.groupFetchAllParticipating().catch(() => ({}))) || {});

	if (!targets.length) return m.reply('Tidak ada target.');
	let ok = 0,
		fail = 0;
	for (const jid of targets) {
		try {
			await conn.sendMessage(jid, { text: `📢 *BROADCAST*\n\n${msg}` });
			ok++;
		} catch {
			fail++;
		}
		await delay(300);
	}
	return m.reply(`✅ Broadcast selesai.\nMode: ${mode}\nDikirim: ${ok}\nGagal: ${fail}`);
};

handler.help = ['broadcast'];
handler.tags = ['owner'];
handler.command = /^(broadcast|bc)$/i;
handler.owner = true;

export default handler;
