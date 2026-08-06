console.log('🐾 Starting...');

import { Worker } from 'worker_threads';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { watchFile, unwatchFile } from 'fs';
import readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rl = readline.createInterface(process.stdin, process.stdout);

let worker = null;
let restartTimer = null;

function spawn(file) {
	const full = join(__dirname, file);
	const w = new Worker(full);
	worker = w;
	if (restartTimer) {
		clearTimeout(restartTimer);
		restartTimer = null;
	}

	w.on('message', (msg) => {
		console.log('[MESSAGE]', msg);
		if (msg === 'restart' || msg === 'reset') restart();
	});

	w.on('exit', (code) => {
		if (w !== worker) return; // worker lama yang sudah digantikan restart manual → abaikan
		worker = null;
		console.log('❗ Worker exited with code', code);
		if (code !== 0) {
			restartTimer = setTimeout(
				() => {
					console.log('⏳ Auto restart...');
					spawn('main.js');
				},
				30 * 60 * 1000
			);
		}
	});
}

function restart() {
	const old = worker;
	worker = null;
	if (old) old.terminate().catch(() => {});
	spawn('main.js');
}

const mainFile = join(__dirname, 'main.js');
function watchMain() {
	unwatchFile(mainFile);
	console.log('♻️ main.js diubah → restart...');
	restart();
	watchFile(mainFile, watchMain);
}
watchFile(mainFile, watchMain);

if (!rl.listenerCount('line')) {
	rl.on('line', (line) => {
		const cmd = line.trim().toLowerCase();
		if (!cmd) return;

		if (cmd === 'exit') {
			console.log('⛔ Exiting...');
			worker?.terminate();
			process.exit(0);
		}
		if (cmd === 'restart' || cmd === 'reset') {
			console.log('🍃Restart...');
			restart();
		}
	});
}

spawn('main.js');
