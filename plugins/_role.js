import { canLevelUp } from '../lib/levelling.js';

let handler = (m) => m;

handler.before = function (m) {
	let user = global.db.data.users[m.sender];
	let before = user?.level * 1;
	if (user?.autolevelup) {
		while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++;
	}

	let role =
		user.level <= 2
			? 'Newbie ㋡'
			: user.level >= 2 && user.level <= 4
				? 'Beginner 1 ⚊¹'
				: user.level >= 4 && user.level <= 6
					? 'Beginner 2 ⚊²'
					: user.level >= 6 && user.level <= 8
						? 'Beginner 3 ⚊³'
						: user.level >= 8 && user.level <= 10
							? 'Beginner 4 ⚊⁴'
							: user.level >= 10 && user.level <= 20
								? 'Adventurer 1 ⚌¹'
								: user.level >= 20 && user.level <= 30
									? 'Adventurer 2 ⚌²'
									: user.level >= 30 && user.level <= 40
										? 'Adventurer 3 ⚌³'
										: user.level >= 40 && user.level <= 50
											? 'Adventurer 4 ⚌⁴'
											: user.level >= 50 && user.level <= 60
												? 'Adventurer 5 ⚌⁵'
												: user.level >= 60 && user.level <= 70
													? 'Fighter 1 ☰¹'
													: user.level >= 70 && user.level <= 80
														? 'Fighter 2 ☰²'
														: user.level >= 80 && user.level <= 90
															? 'Fighter 3 ☰³'
															: user.level >= 90 && user.level <= 100
																? 'Fighter 4 ☰⁴'
																: user.level >= 100 && user.level <= 110
																	? 'Fighter 5 ☰⁵'
																	: user.level >= 110 && user.level <= 120
																		? 'Brigand 1 ≣¹'
																		: user.level >= 120 && user.level <= 130
																			? 'Brigand 2 ≣²'
																			: user.level >= 130 && user.level <= 140
																				? 'Brigand 3 ≣³'
																				: user.level >= 140 && user.level <= 150
																					? 'Brigand 4 ≣⁴'
																					: user.level >= 150 && user.level <= 160
																						? 'Brigand 5 ≣⁵'
																						: user.level >= 160 && user.level <= 170
																							? 'Swordsman 1 ﹀¹'
																							: user.level >= 170 && user.level <= 180
																								? 'Swordsman 2 ﹀²'
																								: user.level >= 180 && user.level <= 190
																									? 'Swordsman 3 ﹀³'
																									: user.level >= 190 && user.level <= 200
																										? 'Swordsman 4 ﹀⁴'
																										: user.level >= 200 && user.level <= 210
																											? 'Swordsman 5 ﹀⁵'
																											: user.level >= 210 && user.level <= 220
																												? 'Brigand 1 ︾¹'
																												: user.level >= 220 && user.level <= 230
																													? 'Brigand 2 ︾²'
																													: user.level >= 230 && user.level <= 240
																														? 'Brigand 3 ︾³'
																														: user.level >= 240 && user.level <= 250
																															? 'Brigand 4 ︾⁴'
																															: user.level >= 250 && user.level <= 260
																																? 'Brigand 5 ︾⁵'
																																: user.level >= 260 && user.level <= 270
																																	? '2nd Lt. Grade 1 ♢¹'
																																	: user.level >= 270 && user.level <= 280
																																		? '2nd Lt. Grade 2 ♢²'
																																		: user.level >= 280 && user.level <= 290
																																			? '2nd Lt. Grade 3 ♢³'
																																			: user.level >= 290 && user.level <= 300
																																				? '2nd Lt. Grade 4 ♢⁴'
																																				: user.level >= 300 && user.level <= 310
																																					? '2nd Lt. Grade 5 ♢⁵'
																																					: user.level >= 310 && user.level <= 320
																																						? '1st Lt. Grade 1 ♢♢¹'
																																						: user.level >= 320 && user.level <= 330
																																							? '1st Lt. Grade 2 ♢♢²'
																																							: user.level >= 330 && user.level <= 340
																																								? '1st Lt. Grade 3 ♢♢³'
																																								: user.level >= 340 && user.level <= 350
																																									? '1st Lt. Grade 4 ♢♢⁴'
																																									: user.level >= 350 &&
																																										  user.level <= 360
																																										? '1st Lt. Grade 5 ♢♢⁵'
																																										: user.level >= 360 &&
																																											  user.level <= 370
																																											? 'Major Grade 1 ✷¹'
																																											: user.level >= 370 &&
																																												  user.level <= 380
																																												? 'Major Grade 2 ✷²'
																																												: user.level >= 380 &&
																																													  user.level <= 390
																																													? 'Major Grade 3 ✷³'
																																													: user.level >=
																																																390 &&
																																														  user.level <=
																																																400
																																														? 'Major Grade 4 ✷⁴'
																																														: user.level >=
																																																	400 &&
																																															  user.level <=
																																																	410
																																															? 'Major Grade 5 ✷⁵'
																																															: user.level >=
																																																		410 &&
																																																  user.level <=
																																																		420
																																																? 'Colonel Grade 1 ✷✷¹'
																																																: user.level >=
																																																			420 &&
																																																	  user.level <=
																																																			430
																																																	? 'Colonel Grade 2 ✷✷²'
																																																	: user.level >=
																																																				430 &&
																																																		  user.level <=
																																																				440
																																																		? 'Colonel Grade 3 ✷✷³'
																																																		: user.level >=
																																																					440 &&
																																																			  user.level <=
																																																					450
																																																			? 'Colonel Grade 4 ✷✷⁴'
																																																			: user.level >=
																																																						450 &&
																																																				  user.level <=
																																																						460
																																																				? 'Colonel Grade 5 ✷✷⁵'
																																																				: user.level >=
																																																							460 &&
																																																					  user.level <=
																																																							470
																																																					? 'Brigadier Early ✰'
																																																					: user.level >=
																																																								470 &&
																																																						  user.level <=
																																																								480
																																																						? 'Brigadier Silver ✩'
																																																						: user.level >=
																																																									480 &&
																																																							  user.level <=
																																																									490
																																																							? 'Brigadier gold ✯'
																																																							: user.level >=
																																																										490 &&
																																																								  user.level <=
																																																										500
																																																								? 'Brigadier Platinum ✬'
																																																								: user.level >=
																																																											500 &&
																																																									  user.level <=
																																																											600
																																																									? 'Brigadier Diamond ✪'
																																																									: user.level >=
																																																												600 &&
																																																										  user.level <=
																																																												700
																																																										? 'Hero '
																																																										: user.level >=
																																																													700 &&
																																																											  user.level <=
																																																													800
																																																											? 'Paladin'
																																																											: user.level >=
																																																														800 &&
																																																												  user.level <=
																																																														900
																																																												? 'Legend'
																																																												: user.level >=
																																																															900 &&
																																																													  user.level <=
																																																															1000
																																																													? 'Demigod'
																																																													: ' 𖤐 G O D 𖤐';
	user.role = role;

	if (user.autolevelup && before !== user.level) {
		m.reply(`Selamat, Kamu Telah Naik Level!\n\n• Level Up : *${before}* -> *${user.level}*`);
	}

	return true;
};

export default handler;
