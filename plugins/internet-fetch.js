import path from 'path';

const handler = async (m, { conn }) => {
	let text = m.quoted ? m.quoted?.text : m?.text;
	if (!text) throw 'Url?';
	if (!/^https?:\/\//i.test(text)) text = text.match(/https?:\/\/\S+/i)?.[0];

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 15000);

	let res;
	try {
		res = await fetch(text, {
			redirect: 'follow',
			headers: {
				'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
			},
			signal: controller.signal,
		});
		clearTimeout(timeout);
	} catch (e) {
		clearTimeout(timeout);
		return m.reply('Gagal fetch URL: ' + e.message);
	}

	if (!res.ok) throw `HTTP Error ${res.status}`;

	const type = (res.headers.get('content-type') || '').split(';')[0];
	const size = Number(res.headers.get('content-length') || 0);

	const MAX = 300 * 1024 * 1024;
	if (size > MAX) throw 'File terlalu besar (300MB)';

	const finalUrl = res.url || text;
	const urlObj = new URL(finalUrl);
	const filename = path.basename(urlObj.pathname) || 'file';

	const chunks = [];
	let total = 0;
	const reader = res.body.getReader();
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		total += value.length;
		if (total > MAX) throw 'File terlalu besar (300MB)';
		chunks.push(value);
	}
	reader.releaseLock();
	const buffer = Buffer.concat(chunks);

	if (type.startsWith('image/')) {
		return conn.sendFile(m.chat, buffer, filename, text, m);
	}

	if (type === 'application/json') {
		try {
			const json = JSON.parse(buffer.toString());
			const pretty = JSON.stringify(json, null, 2);

			await m.reply(pretty.slice(0, 65536));

			return conn.sendMessage(
				m.chat,
				{
					document: Buffer.from(pretty),
					fileName: 'file.json',
					mimetype: 'application/json',
				},
				{ quoted: m }
			);
		} catch {
			return m.reply('JSON rusak');
		}
	}

	if (type.startsWith('text/')) {
		const txt = buffer.toString('utf8');

		await m.reply(txt.slice(0, 65536));

		return conn.sendFile(m.chat, Buffer.from(txt), type === 'text/html' ? 'file.html' : 'file.txt', null, m);
	}

	return conn.sendFile(m.chat, buffer, filename, text, m);
};

handler.help = ['fetch <url>', 'get <url>'];
handler.tags = ['internet'];
handler.command = /^(fetch|get)$/i;

export default handler;
