import { producer, LOG_TABLE } from '../lib/rpg.js';

export default producer({
	command: /^(nebang|log)$/i,
	help: 'nebang',
	tool: 'axe',
	table: LOG_TABLE,
	cd: 'log',
	label: 'menebang kayu',
	emoji: '🪓',
});
