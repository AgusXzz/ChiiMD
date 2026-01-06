import moment from 'moment-timezone';
import * as levelling from '../lib/levelling.js';
import fs from 'fs';

const handler = async (m, { conn, usedPrefix: _p, isOwner, args }) => {
	const allTags = {
		main: 'Main Menu',
		ai: 'Ai Menu',
		downloader: 'Downloader Menu',
		database: 'Database Menu',
		sticker: 'Sticker Menu',
		tools: 'Tools Menu',
		rpg: 'Rpg Menu',
		fun: 'Fun Menu',
		group: 'Group Menu',
		xp: 'XP & Level Menu',
		info: 'Info Menu',
		owner: 'Owner Menu',
	};

	let teks = (args[0] || '').toLowerCase();
	let tags = {};

	if (!Object.keys(allTags).includes(teks) && !Object.values(allTags).some((v) => v.toLowerCase().includes(teks))) {
		teks = 'all';
	}

	tags = teks === 'all' ? { ...allTags } : Object.fromEntries(Object.entries(allTags).filter(([k, v]) => k === teks || v.toLowerCase().includes(teks)));

	if (!isOwner) delete tags.owner;
	if (!m.isGroup) delete tags.group;

	const defaultMenu = {
		before: `
┌ ◦ *[ %me ]*
├ *${ucapan()} %name*
│
│ ◦ Limit : *%limit*
│ ◦ Role : *%role*
│ ◦ Level : *%level (%exp / %maxexp)* [%xp4levelup]
│ ◦ %totalexp XP secara Total
│
│ ◦ Tanggal: *%week, %date*
│ ◦ Uptime: *%uptime*
│ ◦ Database: %rtotalreg dari %totalreg
│
│ ◦ Note :
│ ◦ *🄿* = Premium
│ ◦ *🄻* = Limit
└────
%readmore`.trim(),
		header: '┌ ◦ *[ %category ]*',
		body: '│ ◦ %cmd %flags',
		footer: '└—',
		after: '',
	};

	try {
		const plugins = Object.values(global.plugins).filter((p) => !p.disabled);
		const help = plugins.map((p) => ({
			help: Array.isArray(p.help) ? p.help : [p.help],
			tags: Array.isArray(p.tags) ? p.tags : [p.tags],
			prefix: 'customPrefix' in p,
			limit: p.limit ? '🄻' : '',
			premium: p.premium ? '🄿' : '',
			owner: p.owner ? '🄾' : '',
			mods: p.mods ? '🄼' : '',
		}));

		const text = [
			defaultMenu.before,
			...Object.keys(tags).map((tag) => {
				const items = help
					.filter((p) => p.tags.includes(tag))
					.flatMap((p) =>
						p.help.map((h) => {
							const cmd = p.prefix ? h : `${_p}${h}`;
							const flags = [p.limit, p.premium, p.owner, p.rowner].join(' ');
							return defaultMenu.body
								.replace(/%cmd/g, cmd)
								.replace(/%flags/g, flags)
								.trim();
						})
					)
					.join('\n');
				return `${defaultMenu.header.replace(/%category/g, tags[tag])}\n${items}\n${defaultMenu.footer}`;
			}),
			defaultMenu.after,
		].join('\n');

		let { exp, limit, money, level, role, registered } = global.db.data.users[m.sender];
		let { min, xp, max } = levelling.xpRange(level, global.multiplier);
		let name = registered ? global.db.data.users[m.sender].name : conn.getName(m.sender);
		let _uptime = process.uptime() * 1000;
		let uptime = clockString(_uptime);
		let totalreg = Object.keys(global.db.data.users).length;
		let rtotalreg = Object.values(global.db.data.users).filter((user) => user.registered == true).length;
		let d = new Date(new Date() + 3600000);
		let locale = 'id-ID';
		let week = d.toLocaleDateString(locale, { weekday: 'long' });
		let date = d.toLocaleDateString(locale, {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});

		const replace = {
			'%': '',
			p: _p,
			uptime,
			me: conn.user.name,
			exp: exp - min,
			maxexp: xp,
			totalexp: exp,
			xp4levelup: max - exp <= 0 ? `Siap untuk *${_p}levelup*` : `${max - exp} XP lagi untuk levelup`,
			level,
			limit,
			name,
			money,
			week,
			date,
			totalreg,
			rtotalreg,
			role,
			readmore: readMore,
		};

		conn.sendMessage(
			m.chat,
			{
				document: Buffer.from('YAW :3'),
				fileName: m.pushName,
				fileLength: Date.now(),
				pageCount: new Date().getFullYear(),
				caption: style(text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])),
				contextInfo: {
					mentionedJid: conn.parseMention(text),
					forwardingScore: 10,
					isForwarded: true,
					externalAdReply: {
						title: global.namebot,
						body: `${global.namebot} By ${global.author}`,
						thumbnail: fs.readFileSync(global.pathResolve('../media/menu.jpg')),
						mediaType: 1,
						renderLargerThumbnail: true,
					},
				},
			},
			{ quoted: m }
		);
	} catch (e) {
		console.error(e);
		m.reply('Terjadi kesalahan saat menampilkan menu.');
	}
};

handler.help = ['menu'];
handler.command = /^(menu|help|\?)$/i;
handler.exp = 3;

export default handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function style(text, style = 1) {
	const xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
	const yStr = {
		1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890',
	}[style].split('');
	return text
		.toLowerCase()
		.split('')
		.map((char) => {
			const i = xStr.indexOf(char);
			return i !== -1 ? yStr[i] : char;
		})
		.join('');
}

function clockString(ms) {
	let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
	let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
	let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
	return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':');
}

function ucapan() {
	const time = moment.tz('Asia/Jakarta').format('HH');
	let res = 'Selamat dinihari';
	if (time >= 4) {
		res = 'Selamat pagi';
	}
	if (time > 10) {
		res = 'Selamat siang';
	}
	if (time >= 15) {
		res = 'Selamat sore';
	}
	if (time >= 18) {
		res = 'Selamat malam';
	}
	return res;
}
