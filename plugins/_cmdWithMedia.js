import { proto, generateWAMessage, areJidsSameUser } from 'baileys';

export async function all(m, chatUpdate) {
	if (m.isBaileys) return;
	if (!m.message) return;
	if (!m.msg?.fileSha256) return;
	const hash = Buffer.from(m.msg.fileSha256).toString('base64');
	if (!(hash in global.db.data.sticker)) return;

	const { text, mentionedJid } = global.db.data.sticker[hash];
	const messages = await generateWAMessage(
		m.sender,
		{ text: text, mentions: mentionedJid },
		{
			userJid: this.user.jid,
			quoted: m.quoted && m.quoted.fakeObj,
		}
	);
	messages.key.remoteJid = m.chat;
	messages.key.fromMe = areJidsSameUser(m.chat, this.user.id);
	messages.key.id = m.key.id;
	messages.pushName = m.pushName;
	if (m.isGroup) messages.key.participant = m.sender;
	const msg = {
		...chatUpdate,
		messages: [proto.WebMessageInfo.create(messages)],
		type: 'append',
	};
	this.ev.emit('messages.upsert', msg);
}
