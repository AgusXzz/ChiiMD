import { spawn } from 'child_process';
import { dirname } from 'path';

const __dirname = dirname(new URL(import.meta.url).pathname);

function ytdlp(args) {
	return new Promise((resolve, reject) => {
		const proc = spawn('yt-dlp', args);
		let stdout = '';
		let stderr = '';
		proc.stdout.on('data', (d) => (stdout += d));
		proc.stderr.on('data', (d) => (stderr += d));
		proc.on('error', reject);
		proc.on('close', (code) => {
			if (code !== 0) return reject(new Error(stderr.trim() || `yt-dlp exited with code ${code}`));
			resolve(stdout.trim());
		});
	});
}

export function isYouTubeUrl(url) {
	return /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{11}/.test(url);
}

export async function getInfo(url) {
	const out = await ytdlp(['--no-warnings', '--dump-single-json', '--no-playlist', url]);
	const info = JSON.parse(out);
	return {
		title: info.title,
		uploader: info.uploader,
		duration: info.duration_string,
		durationSec: info.duration,
		views: info.view_count,
		thumbnail: info.thumbnail,
		id: info.id,
	};
}

export async function getAudioUrl(url) {
	const out = await ytdlp(['--no-warnings', '--no-playlist', '-f', 'bestaudio[ext=m4a]/bestaudio/best', '--get-url', url]);
	const download = out.split('\n')[0];
	if (!download || !download.startsWith('http')) throw new Error('Gagal mendapatkan URL audio');
	return download;
}

export async function getVideoUrl(url, quality = 'best') {
	const formatMap = {
		best: 'bestvideo[height<=1080]+bestaudio/best',
		hd: 'bestvideo[height<=720]+bestaudio/best',
		sd: 'bestvideo[height<=480]+bestaudio/best',
	};
	const fmt = formatMap[quality] || formatMap.best;
	const out = await ytdlp(['--no-warnings', '--no-playlist', '-f', fmt, '--merge-output-format', 'mp4', '--get-url', url]);
	const lines = out.split('\n').filter((l) => l.startsWith('http'));
	if (!lines.length) throw new Error('Gagal mendapatkan URL video');
	return lines[lines.length - 1]; // URL terakhir adalah hasil merge
}
