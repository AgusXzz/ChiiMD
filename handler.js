import { smsg } from './lib/simple.js';
import { format } from 'util';
import { fileURLToPath } from 'url';
import path from 'path';
import { unwatchFile, watchFile } from 'fs';
import chalk from 'chalk';

/**
 * Handle messages upsert
 * @param {import('baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate
 */
export async function handler(chatUpdate) {
	if (!chatUpdate) return;
	this.pushMessage(chatUpdate.messages).catch(console.error);
	let m = chatUpdate.messages[chatUpdate.messages.length - 1];
	if (!m) return;
	if (global.db.data == null) await global.loadDatabase();
	try {
		m = smsg(this, m) || m;
		if (!m) return;
		m.exp = 0;
		m.limit = false;

		if (m.sender.endsWith('@broadcast') || m.sender.endsWith('@newsletter')) return;
		await (await import(`./lib/database.js?v=${Date.now()}`)).default(m, this);

		if (typeof m.text !== 'string') m.text = '';

		const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)].map((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
		const isOwner = isROwner || m.fromMe;
		const isPrems = isROwner || db.data.users[m.sender]?.premiumTime > 0;

		if (global.db.data.settings[this.user.jid].gconly && !m.isGroup && !isOwner && !isPrems) return;
		if (!global.db.data.settings[this.user.jid].public && !isOwner && !m.fromMe) return;

		if (m.isBaileys) return;
		m.exp += Math.ceil(Math.random() * 10);

		let usedPrefix;
		let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender];

		const groupMetadata = (m.isGroup ? (conn.chats[m.chat] || {}).metadata || (await this.groupMetadata(m.chat).catch((_) => null)) : {}) || {};
		const participants = (m.isGroup ? groupMetadata.participants : []) || [];
		const user = (m.isGroup ? participants.find((u) => conn.getJid(u.id) === m.sender) : {}) || {}; // User Data
		const bot = (m.isGroup ? participants.find((u) => conn.getJid(u.id) == this.user.jid) : {}) || {}; // Your Data
		const isRAdmin = user?.admin == 'superadmin' || false;
		const isAdmin = isRAdmin || user?.admin == 'admin' || false; // Is User Admin?
		const isBotAdmin = bot?.admin || false; // Are you Admin?

		const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins');
		for (const name in global.plugins) {
			const plugin = global.plugins[name];
			if (!plugin) continue;
			if (plugin.disabled) continue;
			const __filename = path.join(___dirname, name);
			if (typeof plugin.all === 'function') {
				try {
					await plugin.all.call(this, m, {
						chatUpdate,
						__dirname: ___dirname,
						__filename,
					});
				} catch (e) {
					console.error(e);
					for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
						let data = (await conn.onWhatsApp(jid))[0] || {};
						if (data.exists) m.reply(`*Plugin:* ${name}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${m.text}\n\n\`\`\`${format(e)}\`\`\``.trim(), data.jid);
					}
				}
			}
		}

		const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
		let _prefix = global.prefix;
		let match = (
			_prefix instanceof RegExp // RegExp Mode?
				? [[_prefix.exec(m.text), _prefix]]
				: Array.isArray(_prefix) // Array?
				? _prefix.map((p) => {
						let re =
							p instanceof RegExp // RegExp in Array?
								? p
								: new RegExp(str2Regex(p));
						return [re.exec(m.text), re];
				  })
				: typeof _prefix === 'string' // String?
				? [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]]
				: [[[], new RegExp()]]
		).find((p) => p[1]);

		if ((usedPrefix = (match[0] || '')[0])) {
			let noPrefix = m.text.replace(usedPrefix, '');
			let [command, ...args] = noPrefix.trim().split` `.filter((v) => v);
			args = args || [];
			let _args = noPrefix.trim().split` `.slice(1);
			let text = _args.join` `;
			command = (command || '').toLowerCase();
			let plugin = global.commandMap.get(command);

			if (!plugin) {
				for (const regExpPlugin of global.regExpPlugins) {
					const isAccept = regExpPlugin.command.test(command);
					if (isAccept) {
						plugin = regExpPlugin;
						break;
					}
				}
			}

			if (plugin) {
				const __filename = path.join(___dirname, plugin.filename);

				if (plugin.disabled) return;
				if (plugin.tags && plugin.tags.includes('admin')) {
					return;
				}
				if (typeof plugin.before === 'function') {
					if (
						await plugin.before.call(this, m, {
							match,
							conn: this,
							participants,
							groupMetadata,
							user,
							bot,
							isROwner,
							isOwner,
							isRAdmin,
							isAdmin,
							isBotAdmin,
							isPrems,
							chatUpdate,
							__dirname: ___dirname,
							__filename,
						})
					)
						return;
				}
				if (typeof plugin !== 'function') return;

				m.plugin = plugin.filename;
				if (!isOwner && (m.chat in global.db.data.chats || m.sender in global.db.data.users)) {
					let chat = global.db.data.chats[m.chat];
					if (plugin.filename != 'tools-delete.js' && chat?.isBanned) return; // Except this
				}
				if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
					// Both Owner
					fail('owner', m, this);
					return;
				}
				if (plugin.rowner && !isROwner) {
					// Real Owner
					fail('rowner', m, this);
					return;
				}
				if (plugin.owner && !isOwner) {
					// Number Owner
					fail('owner', m, this);
					return;
				}
				if (plugin.premium && !isPrems) {
					// Premium
					fail('premium', m, this);
					return;
				}
				if (plugin.group && !m.isGroup) {
					// Group Only
					fail('group', m, this);
					return;
				} else if (plugin.botAdmin && !isBotAdmin) {
					// You Admin
					fail('botAdmin', m, this);
					return;
				} else if (plugin.admin && !isAdmin) {
					// User Admin
					fail('admin', m, this);
					return;
				}
				if (plugin.private && m.isGroup) {
					// Private Chat Only
					fail('private', m, this);
					return;
				}
				if (plugin.register == true && _user.registered == false) {
					// Butuh daftar?
					fail('unreg', m, this);
					return;
				}
				m.isCommand = true;
				let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17; // XP Earning per command
				if (xp > 200)
					m.reply('Ngecit -_-'); // Hehehe
				else m.exp += xp;
				if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
					this.reply(m.chat, `[❗] Limit anda habis, silahkan beli melalui *${usedPrefix}buy limit*`, m);
					return; // Limit habis
				}
				if (plugin.level > _user.level) {
					this.reply(m.chat, `[💬] Diperlukan level ${plugin.level} untuk menggunakan perintah ini\n*Level mu:* ${_user.level} 📊`, m);
					return; // If the level has not been reached
				}
				let extra = {
					match,
					usedPrefix,
					noPrefix,
					_args,
					args,
					command,
					text,
					conn: this,
					participants,
					groupMetadata,
					user,
					bot,
					isROwner,
					isOwner,
					isRAdmin,
					isAdmin,
					isBotAdmin,
					isPrems,
					chatUpdate,
					__dirname: ___dirname,
					__filename,
				};
				try {
					await plugin.call(this, m, extra);
					if (!isPrems) m.limit = m.limit || plugin.limit || false;
				} catch (e) {
					// Error occured
					m.error = e;
					console.error(e);
					if (e) {
						let text = format(e);
						if (e.name)
							for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
								let data = (await conn.onWhatsApp(jid))[0] || {};
								if (data.exists)
									m.reply(
										`*🗂️ Plugin:* ${m.plugin}\n*👤 Sender:* ${m.sender}\n*💬 Chat:* ${m.chat}\n*💻 Command:* ${usedPrefix}${command} ${args.join(' ')}\n📄 *Error Logs:*\n\n\`\`\`${text}\`\`\``.trim(),
										data.jid
									);
							}
						m.reply(text);
					}
				} finally {
					if (typeof plugin.after === 'function') {
						try {
							await plugin.after.call(this, m, extra);
						} catch (e) {
							console.error(e);
						}
					}
					if (m.limit) m.reply(+m.limit + ' Limit terpakai ✔️');
				}
			}
		}
	} catch (e) {
		console.error(e);
	} finally {
		let user,
			stats = global.db.data.stats;

		if (m) {
			if (m.sender && (user = global.db.data.users[m.sender])) {
				user.exp += Number(m.exp || 0);
				user.limit -= Number(m.limit || 0);
			}

			if (m.plugin) {
				const now = Date.now();

				stats[m.plugin] = {
					total: 0,
					success: 0,
					last: 0,
					lastSuccess: 0,
					...stats[m.plugin],
				};

				stats[m.plugin].total++;
				stats[m.plugin].last = now;

				if (!m.error) {
					stats[m.plugin].success++;
					stats[m.plugin].lastSuccess = now;
				}
			}
		}

		try {
			await (await import(`./lib/print.js`)).default(m, this);
		} catch (e) {
			console.log(m, m.quoted, e);
		}
		if (global.db.data.settings[this.user.jid]?.autoread) await conn.readMessages([m.key]);
	}
}

/**
 * Handle groups participants update
 * @param {import('baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate
 */
export async function participantsUpdate({ id, participants, action, simulate = false }) {
	// if (id in conn.chats) return // First login will spam
	if (this.isInit && !simulate) return;
	if (global.db.data == null) await loadDatabase();
	let chat = global.db.data.chats[id] || {};
	let text = '';
	const groupMetadata = (conn.chats[id] || {}).metadata || (await this.groupMetadata(id));
	switch (action) {
		case 'add':
		case 'remove':
			if (chat.welcome) {
				for (let user of participants) {
					user = this.getJid(user?.phoneNumber || user.id);
					const tamnel = await this.profilePictureUrl(user, 'image', 'buffer');
					text = (action === 'add' ? chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!' : chat.sBye || this.bye || conn.bye || 'Bye, @user!')
						.replace('@user', `@${user.split('@')[0]}`)
						.replace('@subject', this.getName(id))
						.replace('@desc', groupMetadata.desc || '');
					this.sendMessage(
						id,
						{
							text,
							contextInfo: {
								mentionedJid: [user],
								externalAdReply: {
									title: action == 'add' ? '💌 WELCOME' : '🐾 BYE',
									body: action == 'add' ? 'YAELAH BEBAN GROUP NAMBAH 1 :(' : 'BYE BEBAN! :)',
									mediaType: 1,
									previewType: 'PHOTO',
									renderLargerThumbnail: true,
									thumbnail: tamnel,
								},
							},
						},
						{
							ephemeralExpiration: groupMetadata.ephemeralDuration,
						}
					);
				}
			}
			break;
		case 'promote':
		case 'demote':
			for (let users of participants) {
				let user = this.getJid(users?.phoneNumber || users.id);
				text = (
					action === 'promote'
						? chat.sPromote || this.spromote || conn.spromote || '@user ```is now Admin```'
						: chat.sDemote || this.sdemote || conn.sdemote || '@user ```is no longer Admin```'
				)
					.replace('@user', '@' + user.split('@')[0])
					.replace('@subject', this.getName(id))
					.replace('@desc', groupMetadata.desc || '');
				if (chat.detect) this.sendMessage(id, { text, mentions: this.parseMention(text) });
			}
			break;
	}
}
/**
 * Handle groups update
 * @param {import('baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate
 */
export async function groupsUpdate(groupsUpdate) {
	for (const groupUpdate of groupsUpdate) {
		const id = groupUpdate.id;
		if (!id) continue;
		let chats = global.db.data.chats[id],
			text = '';
		if (!chats?.detect) continue;
		if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || conn.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc);
		if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || conn.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject);
		if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon);
		if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke);
		if (!text) continue;
		await this.sendMessage(id, { text, mentions: this.parseMention(text) });
	}
}

export async function deleteUpdate(message) {
	try {
		const { fromMe, id, participant } = message;
		if (fromMe) return;
		let msg = this.serializeM(this.loadMessage(id));
		if (!msg) return;
		let chat = global.db.data.chats[msg.chat];
		if (!chat.delete) return;
		await this.reply(
			msg.chat,
			`
Terdeteksi @${participant.split`@`[0]} telah menghapus pesan
Untuk mematikan fitur ini, ketik
*.enable delete*
`.trim(),
			msg,
			{
				mentions: [participant],
			}
		);
		this.copyNForward(msg.chat, msg).catch((e) => console.log(e, msg));
	} catch (e) {
		console.error(e);
	}
}

global.dfail = (type, m, conn) => {
	let msg = {
		rowner: 'Only Developer - Command ini hanya untuk developer bot',
		owner: 'Only Owner - Command ini hanya untuk owner bot',
		premium: 'Only Premium - Command ini hanya untuk pengguna premium',
		group: 'Group Chat - Command ini hanya bisa dipakai di dalam grup',
		private: 'Private Chat - Command ini hanya bisa dipakai di private chat',
		admin: 'Only Admin - Command ini hanya untuk admin grup',
		botAdmin: 'Only Bot Admin - Command ini hanya bisa digunakan ketika bot menjadi admin',
		unreg: 'Halo kak! 👋 Anda harus mendaftar ke database bot dulu sebelum menggunakan fitur ini\nCara daftarnya tulis .daftar Nama.umur',
		restrict: 'Restrict - Fitur restrict belum diaktifkan di chat ini',
	}[type];
	if (msg) return conn.reply(m.chat, msg, m);
};

let file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
	unwatchFile(file);
	console.log(chalk.redBright("Update 'handler.js'"));
	if (global.reloadHandler) console.log(await global.reloadHandler());
});
