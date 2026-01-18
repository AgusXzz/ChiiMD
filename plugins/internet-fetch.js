import axios from 'axios';
import path from 'path';

let handler = async (m, { text, conn }) => {
	if (!text) return m.reply('Url?');
	if (!/^https?:\/\//i.test(text)) text = 'http://' + text;

	let res;
	try {
		res = await axios.get(text, {
			responseType: 'arraybuffer',
			timeout: 15000,
			maxRedirects: 5,
			headers: {
				'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
			},
		});
	} catch (e) {
		return m.reply('Gagal fetch URL: ' + e.message);
	}

	const headers = res.headers || {};
	const type = (headers['content-type'] || '').split(';')[0];
	const size = Number(headers['content-length'] || 0);

	if (size > 200 * 1024 * 1024) return m.reply('File terlalu besar (100MB)');

	const urlObj = new URL(res.request.res.responseUrl || text);
	const filename = path.basename(urlObj.pathname) || 'file';

	if (type.startsWith('image/')) {
		return conn.sendFile(m.chat, res.data, filename, text, m);
	}

	if (type === 'application/json') {
		try {
			const json = JSON.parse(res.data.toString());
			const pretty = JSON.stringify(json, null, 2);
			await m.reply(pretty.slice(0, 65536));
			return conn.sendMessage(m.chat, { document: Buffer.from(pretty), fileName: 'file.json', mimetype: 'application/json' }, { quoted: m });
		} catch {
			return m.reply('JSON rusak');
		}
	}

	if (type.startsWith('text/')) {
		const txt = res.data.toString('utf8');
		await m.reply(txt.slice(0, 65536));
		return conn.sendFile(m.chat, Buffer.from(txt), type === 'text/html' ? 'file.html' : 'file.txt', null, m);
	}

	return conn.sendFile(m.chat, res.data, filename, text, m);
};

handler.help = ['fetch <url>', 'get <url>'];
handler.tags = ['internet'];
handler.command = /^(fetch|get)$/i;

export default handler;
