import { runBackup } from '../lib/backup.js';

let handler = async (m) => {
	const dest = runBackup();
	if (!dest) return m.reply('❌ Backup gagal. Cek log.');
	return m.reply(`✅ Backup berhasil!\n📁 ${dest}`);
};

handler.help = ['backup'];
handler.tags = ['owner'];
handler.command = /^(backup)$/i;
handler.owner = true;

export default handler;
