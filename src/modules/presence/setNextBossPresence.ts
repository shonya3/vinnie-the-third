import { timeString } from '../../lib/dates.js';
import { Client } from 'discord.js';
import { setPresence } from '../../lib/discord.js';
import { bossScheduleModule } from '../bossSchedule/mod.js';

const generateBossQueue = () =>
	Array.from(bossScheduleModule.generateBossMap().values()).map(bossArray => bossArray.join(', '));

let bossNames = generateBossQueue();

export const setNextBossPresence = (client: Client) => {
	if (!bossNames.length) bossNames = generateBossQueue();
	const nextBoss = bossNames.shift();
	if (!nextBoss) throw new Error('No next boss');

	const presence = setPresence(client, nextBoss);
	const justUpdated = presence.activities[0].name;
	console.log(
		`${timeString(new Date())} Статус бота обновлен: ${justUpdated}. Боссы на очереди: ${bossNames
			.slice(0, 3)
			.join(', ')}`
	);
	return presence;
};
