import { canLevelUp } from '../lib/levelling.js';

const ROLES = [
	[0, 'Newbie ㋡'],
	[3, 'Beginner 1 ⚊¹'],
	[5, 'Beginner 2 ⚊²'],
	[7, 'Beginner 3 ⚊³'],
	[9, 'Beginner 4 ⚊⁴'],
	[11, 'Adventurer 1 ⚌¹'],
	[21, 'Adventurer 2 ⚌²'],
	[31, 'Adventurer 3 ⚌³'],
	[41, 'Adventurer 4 ⚌⁴'],
	[51, 'Adventurer 5 ⚌⁵'],
	[61, 'Fighter 1 ☰¹'],
	[71, 'Fighter 2 ☰²'],
	[81, 'Fighter 3 ☰³'],
	[91, 'Fighter 4 ☰⁴'],
	[101, 'Fighter 5 ☰⁵'],
	[111, 'Brigand 1 ≣¹'],
	[121, 'Brigand 2 ≣²'],
	[131, 'Brigand 3 ≣³'],
	[141, 'Brigand 4 ≣⁴'],
	[151, 'Brigand 5 ≣⁵'],
	[161, 'Swordsman 1 ﹀¹'],
	[171, 'Swordsman 2 ﹀²'],
	[181, 'Swordsman 3 ﹀³'],
	[191, 'Swordsman 4 ﹀⁴'],
	[201, 'Swordsman 5 ﹀⁵'],
	[211, 'Brigand 1 ︾¹'],
	[221, 'Brigand 2 ︾²'],
	[231, 'Brigand 3 ︾³'],
	[241, 'Brigand 4 ︾⁴'],
	[251, 'Brigand 5 ︾⁵'],
	[261, '2nd Lt. Grade 1 ♢¹'],
	[271, '2nd Lt. Grade 2 ♢²'],
	[281, '2nd Lt. Grade 3 ♢³'],
	[291, '2nd Lt. Grade 4 ♢⁴'],
	[301, '2nd Lt. Grade 5 ♢⁵'],
	[311, '1st Lt. Grade 1 ♢♢¹'],
	[321, '1st Lt. Grade 2 ♢♢²'],
	[331, '1st Lt. Grade 3 ♢♢³'],
	[341, '1st Lt. Grade 4 ♢♢⁴'],
	[351, '1st Lt. Grade 5 ♢♢⁵'],
	[361, 'Major Grade 1 ✷¹'],
	[371, 'Major Grade 2 ✷²'],
	[381, 'Major Grade 3 ✷³'],
	[391, 'Major Grade 4 ✷⁴'],
	[401, 'Major Grade 5 ✷⁵'],
	[411, 'Colonel Grade 1 ✷✷¹'],
	[421, 'Colonel Grade 2 ✷✷²'],
	[431, 'Colonel Grade 3 ✷✷³'],
	[441, 'Colonel Grade 4 ✷✷⁴'],
	[451, 'Colonel Grade 5 ✷✷⁵'],
	[461, 'Brigadier Early ✰'],
	[471, 'Brigadier Silver ✩'],
	[481, 'Brigadier gold ✯'],
	[491, 'Brigadier Platinum ✬'],
	[501, 'Brigadier Diamond ✪'],
	[601, 'Hero '],
	[701, 'Paladin'],
	[801, 'Legend'],
	[901, 'Demigod'],
	[1001, ' 𖤐 G O D 𖤐'],
];

const roleFor = (level) => {
	let role = ROLES[0][1];
	for (const [start, name] of ROLES) if (level >= start) role = name;
	return role;
};

export { roleFor };

const handler = (m) => m;

handler.before = function (m) {
	const user = global.db.data.users[m.sender];
	const before = user?.level * 1;
	if (user?.autolevelup) {
		let guard = 1000;
		while (canLevelUp(user.level, user.exp, global.multiplier) && guard-- > 0) user.level++;
	}

	user.role = roleFor(user.level);

	if (user.autolevelup && before !== user.level) {
		m.reply(`Selamat, Kamu Telah Naik Level!\n\n• Level Up : *${before}* -> *${user.level}*`);
	}

	return true;
};

export default handler;
