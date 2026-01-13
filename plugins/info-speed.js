import os from 'os';
import fs from 'fs';

let handler = async (m) => {
	const start = Date.now();
	await m.react('🍌');

	const totalMem = os.totalmem();
	const freeMem = os.freemem();
	const usedMem = totalMem - freeMem;
	const memPercent = ((usedMem / totalMem) * 100).toFixed(1);

	let cap = `\`Server Information\`
* Running On : ${process.env.USER === 'root' ? 'VPS' : 'HOSTING ( PANEL )'}
* Home Dir : ${os.homedir()}
* Tmp Dir : ${os.tmpdir()} *( ${fs.readdirSync(os.tmpdir()).length} Files )*
* Hostname : ${os.hostname()}
* Node Version : ${process.version}
* Cwd : ${process.cwd()}

\`Management Server\`
* Bot Speed : ${Date.now() - start} ms
* Uptime Bot : ${toTime(process.uptime() * 1000)}
* Uptime Server : ${toTime(os.uptime() * 1000)}
* Memory : ${formatSize(usedMem)} / ${formatSize(totalMem)} (${memPercent}%)
* CPU : ${os.cpus()[0].model}
* Release : ${os.release()}
* Type : ${os.type()}`;

	m.reply(cap);
};

handler.help = ['ping'];
handler.tags = ['info'];
handler.command = ['ping', 'speed', 'os'];

export default handler;

function toTime(ms) {
	let d = Math.floor(ms / 86400000);
	let h = Math.floor((ms % 86400000) / 3600000);
	let m = Math.floor((ms % 3600000) / 60000);
	let s = Math.floor((ms % 60000) / 1000);

	return (d ? `${d}d ` : '') + (h ? `${h}h ` : '') + (m ? `${m}m ` : '') + (s ? `${s}s` : '');
}

function formatSize(size) {
	const multiplier = Math.pow(10, 1);
	return Math.round((size / (1024 * 1024)) * multiplier) / multiplier + 'MiB';
}
