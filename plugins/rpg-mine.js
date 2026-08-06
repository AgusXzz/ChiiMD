import { producer, MINE_TABLE } from '../lib/rpg.js';

export default producer({
	command: /^(mine|tambang)$/i,
	help: 'mine',
	tool: 'pickaxe',
	table: MINE_TABLE,
	cd: 'mine',
	label: 'menambang',
	emoji: '⛏️',
});
