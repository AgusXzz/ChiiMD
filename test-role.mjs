import { roleFor } from './plugins/_role.js';

const check = (l, expect) => {
	const got = roleFor(l);
	if (got !== expect) throw new Error(`level ${l}: got "${got}" expected "${expect}"`);
};

check(0, 'Newbie ㋡');
check(2, 'Newbie ㋡');
check(3, 'Beginner 1 ⚊¹');
check(4, 'Beginner 1 ⚊¹');
check(21, 'Adventurer 2 ⚌²');
check(51, 'Adventurer 5 ⚌⁵');
check(1000, 'Demigod');
check(1001, ' 𖤐 G O D 𖤐');

console.log('roleFor passed');
