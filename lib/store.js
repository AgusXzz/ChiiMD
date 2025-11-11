/**
 * @param {import('baileys').WASocket | import('baileys').WALegacySocket}
 */
function bind(conn) {
	if (!conn.chats) conn.chats = {}
	/**
	 *
	 * @param {import('baileys').Contact[]|{contacts:import('baileys').Contact[]}} contacts
	 * @returns
	 */
	function updateNameToDb(contacts) {
		if (!contacts) return
		try {
			contacts = contacts.contacts || contacts
			for (const contact of contacts) {
				const id = conn.decodeJid(contact.id)
				if (!id || id === 'status@broadcast') continue
				let chats = conn.chats[id]
				if (!chats) chats = conn.chats[id] = { ...contact, id }
				conn.chats[id] = {
					...chats,
					...({
						...contact,
						id,
						...(id.endsWith('@g.us') ? { subject: contact.subject || contact.name || chats.subject || '' } : { name: contact.notify || contact.name || chats.name || chats.notify || '' }),
					} || {}),
				}
			}
		} catch (e) {
			console.error(e)
		}
	}
	conn.ev.on('contacts.upsert', updateNameToDb)
	conn.ev.on('groups.update', updateNameToDb)
	conn.ev.on('contacts.set', updateNameToDb)
	conn.ev.on('chats.set', async ({ chats }) => {
		try {
			for (let { id, name, readOnly } of chats) {
				id = conn.decodeJid(id)
				if (!id || id === 'status@broadcast') continue
				const isGroup = id.endsWith('@g.us')
				let chats = conn.chats[id]
				if (!chats) chats = conn.chats[id] = { id }
				chats.isChats = !readOnly
				if (name) chats[isGroup ? 'subject' : 'name'] = name
				if (isGroup) {
					const metadata = await conn.groupMetadata(id).catch((_) => null)
					if (name || metadata?.subject) chats.subject = name || metadata.subject
					if (!metadata) continue
					chats.metadata = metadata
				}
			}
		} catch (e) {
			console.error(e)
		}
	})

	conn.ev.on('group-participants.update', async ({ id, participants, action }) => {
		if (!id) return
		id = conn.decodeJid(id)
		if (id === 'status@broadcast') return
		if (!(id in conn.chats)) conn.chats[id] = { id }
		let chat = conn.chats[id]
		chat.isChats = true

		let metadata = chat.metadata
		if (!metadata) {
			try {
				metadata = await conn.groupMetadata(id)
				chat.metadata = metadata
				chat.subject = metadata.subject
			} catch (e) {
				console.error('Gagal ambil metadata grup:', e)
			}
		}

		switch (action) {
			case 'add':
			case 'revoked_membership_requests':
				for (const p of participants) {
					if (!metadata.participants.find((x) => x.id === p.id)) metadata.participants.push(p)
				}
				break

			case 'promote':
			case 'demote':
				for (const p of participants) {
					const target = metadata.participants.find((x) => x.id === p.id)
					if (target) target.admin = action === 'promote' ? 'admin' : null
				}
				break

			case 'remove':
				metadata.participants = metadata.participants.filter((a) => !participants.find((b) => b.id === a.id))
				break
		}
	})

	conn.ev.on('groups.update', (updates) => {
		for (const update of updates) {
			const id = conn.decodeJid(update.id)
			if (!id || id === 'status@broadcast') continue
			const isGroup = id.endsWith('@g.us')
			if (!isGroup) continue
			const chat = conn.chats[id]
			if (!chat) chats = conn.chats[id] = { id }
			chat.isChats = true
			chat.metadata = {
				...(chat.metadata || {}),
				...update,
			}
			if (update.subject) chat.subject = update.subject || metadata.subject
		}
	})

	conn.ev.on('chats.upsert', (chatsUpsert) => {
		try {
			const { id } = chatsUpsert
			if (!id || id === 'status@broadcast') return
			conn.chats[id] = { ...(conn.chats[id] || {}), ...chatsUpsert, isChats: true }
			const isGroup = id.endsWith('@g.us')
			if (isGroup) conn.insertAllGroup().catch((_) => null)
		} catch (e) {
			console.error(e)
		}
	})

	conn.ev.on('presence.update', async ({ id, presences }) => {
		try {
			const sender = Object.keys(presences)[0] || id
			const _sender = conn.decodeJid(sender)
			const presence = presences[sender]['lastKnownPresence'] || 'composing'
			let chats = conn.chats[_sender]
			if (!chats) chats = conn.chats[_sender] = { id: sender }
			chats.presences = presence
			if (id.endsWith('@g.us')) {
				let chats = conn.chats[id]
				if (!chats) chats = conn.chats[id] = { id }
			}
		} catch (e) {
			console.error(e)
		}
	})
}

export default {
	bind,
}
