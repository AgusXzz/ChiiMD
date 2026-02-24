import path from 'path';

let handler = async (m, { conn }) => {
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

	if (size > 200 * 1024 * 1024) throw 'File terlalu besar (200MB)';

	const finalUrl = res.url || text;
	const urlObj = new URL(finalUrl);
	const filename = path.basename(urlObj.pathname) || 'file';

	const buffer = Buffer.from(await res.arrayBuffer());

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
