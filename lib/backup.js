import fs from 'fs';
import path from 'path';

export function runBackup() {
	try {
		const backupDir = path.resolve('./backup');
		const stamp = new Date().toISOString().replace(/[:.]/g, '-');
		const dest = path.join(backupDir, stamp);
		fs.mkdirSync(dest, { recursive: true });

		if (global.db?.sqlite) {
			global.db.sqlite.backup(path.join(dest, 'database.db'));
		} else if (fs.existsSync('./data')) {
			fs.cpSync('./data', path.join(dest, 'data'), { recursive: true });
		}
		if (fs.existsSync('./sessions')) fs.cpSync('./sessions', path.join(dest, 'sessions'), { recursive: true });

		const dirs = fs
			.readdirSync(backupDir)
			.map((d) => path.join(backupDir, d))
			.filter((d) => fs.statSync(d).isDirectory())
			.sort();
		for (const old of dirs.slice(0, Math.max(0, dirs.length - 5))) fs.rmSync(old, { recursive: true, force: true });

		return dest;
	} catch (e) {
		console.error('[BACKUP]', e);
		return null;
	}
}
