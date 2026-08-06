import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

global.pairingNumber = 6285955111472;
global.owner = [['6287701656619', 'Agus', true]];

global.namebot = 'ChiiBOT - MD';
global.author = 'Agus';
global.source = 'https://chat.whatsapp.com/LF76mRDRwLlI4pdbMi0d5A?mode=hqrc';

global.wait = 'Loading...';
global.eror = 'Terjadi Kesalahan...';

global.pakasir = {
	slug: 'kilersbotz',
	apikey: process.env.PAKASIR_APIKEY || 'bWDO2M8GcfruzXscdKNQJC3vw8Y8PV13',
	expired: 30, //1 = 1menit. 30 = 30menit
};

global.stickpack = 'Croted By';
global.stickauth = namebot;

global.multiplier = 38; // The higher, The harder levelup

/* ============== EMOJI ============== */
global.emoji = {
	potion: '🧪',
	elixir: '🔵',
	bread: '🍞',
	steak: '🥩',
	wood: '🪵',
	stone: '🪨',
	coal: '⬛',
	iron: '⛓️',
	gold: '🪙',
	gem: '💎',
	herb: '🌿',
	meat: '🍖',
	hide: '🧶',
	tusk: '🦷',
	feather: '🪶',
	rarewood: '🪵',
	fish_sardine: '🐟',
	fish_salmon: '🐠',
	fish_shark: '🦈',
	wheat: '🌾',
	corn: '🌽',
	carrot: '🥕',
	potato: '🥔',
	seed_wheat: '🌱',
	seed_corn: '🌱',
	seed_carrot: '🌱',
	seed_potato: '🌱',
	pickaxe_wood: '⛏️',
	pickaxe_iron: '⛏️',
	pickaxe_gold: '⛏️',
	pickaxe_diamond: '⛏️',
	axe_wood: '🪓',
	axe_iron: '🪓',
	axe_gold: '🪓',
	axe_diamond: '🪓',
	rod_wood: '🎣',
	rod_iron: '🎣',
	rod_gold: '🎣',
	rod_diamond: '🎣',
	wooden_sword: '🗡️',
	iron_sword: '🗡️',
	steel_sword: '⚔️',
	dragon_sword: '🗡️',
	demon_blade: '🔪',
	leather_armor: '🦺',
	iron_armor: '🛡️',
	knight_armor: '🛡️',
	dragon_armor: '🐉',
	angel_armor: '👼',
	ring_hp: '💍',
	amulet_mana: '📿',
	crit_ring: '💥',
	baby_dragon: '🐉',
	guardian_spirit: '👻',
	fairy: '🧚',
	phoenix: '🔥',
	crate_common: '📦',
	crate_uncommon: '🎁',
	crate_mythic: '🗃️',
	crate_legendary: '👑',
	buku_kekuatan: '📖',
	buku_ketahanan: '📖',
	buku_vitalitas: '📖',
	buku_sihir: '📖',
	buku_ketepatan: '📖',
	ramuan_kekuatan: '🧪',
	ramuan_baja: '🧪',
	elixir_emas: '⚗️',
	elixir_pengalaman: '⚗️',
	pedang_api: '🔥',
	tombak_pemburu: '🔱',
	baju_es: '🧊',
	cincin_kecepatan: '💫',
	pedang_taring: '🐺',
	baju_mahkota: '👑',
	pedang_kegelapan: '🌑',
	cincin_iblis: '😈',
	taring_hutan: '🦁',
	tengkorak_troll: '💀',
	mahkota_vampir: '🧛',
	hati_iblis: '👿',
	kristal_iblis: '🔮',
	obor: '🔥',
	jimat: '🧿',
	biji_ajaib: '✨',
	kristal_gelap: '🌒',
	cincin_naga: '🐉',
	money: '💹',
	limit: '🎫',
	bank: '🏦',
	exp: '✨',
	hp: '❤️',
	mana: '🔷',
};

let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
	unwatchFile(file);
	console.log(chalk.redBright("Update 'config.js'"));
	import(`${file}?update=${Date.now()}`);
});
