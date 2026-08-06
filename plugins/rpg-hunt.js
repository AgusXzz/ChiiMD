import { producer, HUNT_TABLE } from '../lib/rpg.js';

export default producer({
	command: /^(buru|hunt)$/i,
	help: 'buru',
	table: HUNT_TABLE,
	cd: 'hunt',
	label: 'berburu',
	emoji: '🏹',
});
