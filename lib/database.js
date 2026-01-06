export default function (m, conn) {
	try {
		const defaultUser = {
			name: m.name,
			exp: 0,
			money: 0,
			health: 100,
			level: 1,
			limit: 20,
			age: -1,
			regTime: -1,
			afk: -1,
			afkReason: '',
			warn: 0,
			role: 'Newbie',
			premium: false,
			premiumTime: 0,
			registered: false,
			banned: false,
			autolevelup: false,
			// Bibit
			bibitapel: 0,
			bibitjeruk: 0,
			bibitdurian: 0,
			bibitmangga: 0,
			bibitpisang: 0,
			// Buah
			apel: 0,
			jeruk: 0,
			durian: 0,
			mangga: 0,
			pisang: 0,
			// Hewan
			banteng: 0,
			harimau: 0,
			gajah: 0,
			kambing: 0,
			panda: 0,
			buaya: 0,
			kerbau: 0,
			sapi: 0,
			monyet: 0,
			babihutan: 0,
			babi: 0,
			ayam: 0,

			ikan: 0,
			lele: 0,
			nila: 0,
			bawal: 0,
			udang: 0,
			paus: 0,
			kepiting: 0,
			// Tools
			sword: 0,
			pickaxe: 0,
			axe: 0,
			fishingrod: 0,
			armor: 0,
			atm: 0,
			// Durability
			sworddurability: 0,
			pickaxedurability: 0,
			axedurability: 0,
			fishingroddurability: 0,
			armordurability: 0,
			fullatm: 0,

			// Items
			potion: 0,
			string: 0,
			wood: 0,
			rock: 0,
			coal: 0,
			iron: 0,
			diamond: 0,
			emerald: 0,
			trash: 0,
			common: 0,
			uncommon: 0,
			mythic: 0,
			legendary: 0,
			// Food
			ayambakar: 0,
			ayamgoreng: 0,
			oporayam: 0,
			gulaiayam: 0,
			steak: 0,
			rendang: 0,
			babipanggang: 0,
			ikanbakar: 0,
			lelebakar: 0,
			nilabakar: 0,
			bawalbakar: 0,
			udangbakar: 0,
			pausbakar: 0,
			kepitingbakar: 0,
			// LAST ACTION
			lastadventure: 0,
			lastbansos: 0,
			lastberburu: 0,
			lastdagang: 0,
			lastduel: 0,
			lastrampok: 0,
			lastmining: 0,
			lastnebang: 0,
			lastnguli: 0,
			lastclaim: 0,
			lastweekly: 0,
			lastmonthly: 0,
		};

		const defaultChat = {
			sWelcome: '',
			sBye: '',
			sPromote: '',
			sDemote: '',
			isBanned: false,
			welcome: false,
			detect: false,
			delete: false,
		};

		const defaultSettings = {
			public: true,
			autoread: true,
			anticall: true,
			gconly: true,
		};

		// === USER ===
		if (m.sender.endsWith('@s.whatsapp.net')) {
			if (!global.db.data.users[m.sender])
				global.db.data.users[m.sender] = {
					...defaultUser,
				};
			else (Object.assign(defaultUser, global.db.data.users[m.sender]), (global.db.data.users[m.sender] = defaultUser));
		}

		// === GROUP ===
		if (m.isGroup) {
			if (!global.db.data.chats[m.chat])
				global.db.data.chats[m.chat] = {
					...defaultChat,
				};
			else (Object.assign(defaultChat, global.db.data.chats[m.chat]), (global.db.data.chats[m.chat] = defaultChat));
		}

		// === SETTINGS ===
		if (!global.db.data.settings[conn.user.jid])
			global.db.data.settings[conn.user.jid] = {
				...defaultSettings,
			};
		else (Object.assign(defaultSettings, global.db.data.settings[conn.user.jid]), (global.db.data.settings[conn.user.jid] = defaultSettings));
	} catch (e) {
		console.error(e);
	}
}
