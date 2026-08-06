import { producer, FISH_TABLE } from '../lib/rpg.js';

export default producer({
	command: /^(mancing|fish)$/i,
	help: 'mancing',
	tool: 'rod',
	table: FISH_TABLE,
	cd: 'fish',
	label: 'memancing',
	emoji: '🎣',
});
