export async function before(m, { isAdmin, isOwner, isBotAdmin }) {
	if (m.text && global.prefix.test(m.text)) return;
	const user = global.db.data.users[m.sender];
	const chat = global.db.data.chats[m.chat];

	if (!m.isBaileys || m.mtype === 'protocolMessage' || m.mtype === 'pollUpdateMessage' || m.mtype === 'reactionMessage') return;
	if (!m.msg || !m.message || m.key.remoteJid !== m.chat || user.banned || chat.isBanned) return;

	this.spam = this.spam || {};
	this.spam[m.sender] = this.spam[m.sender] || { count: 0, lastspam: 0 };
	const now = m.messageTimestamp?.low || m.messageTimestamp;
	const timeDifference = now - this.spam[m.sender].lastspam;

	if (timeDifference < 10) {
		this.spam[m.sender].count++;
		if (this.spam[m.sender].count >= 5 && !isOwner && !isAdmin && !isBotAdmin) {
			user.banned = true;
			this.spam[m.sender].lastspam = now;
			//const remainingCooldown = Math.ceil((this.spam[m.sender].lastspam - now) / 1000)

			setTimeout(() => {
				user.banned = false;
				this.spam[m.sender].count = 0;

				conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
			}, 10000);

			return m.reply('⚠️ Kamu telah terbanned tunggu setelah 10 detik..');
		}
	} else {
		this.spam[m.sender].count = 0;
	}

	this.spam[m.sender].lastspam = now;
}
