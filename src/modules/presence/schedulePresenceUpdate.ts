import { Client } from 'discord.js';
import { scheduleJob } from 'node-schedule';
import { generateBossMap } from '../bossSchedule/generateBossMap.js';
import { setNextBossPresence } from './setNextBossPresence.js';
import { getPresence, setPresence } from '../../lib/discord.js';
const watchPresence = (client: Client) => setInterval(() => setPresence(client, getPresence(client)), 3000 * 60);

export const schedulePresenceUpdate = (client: Client) => {
	const bossTimestamps = Array.from(generateBossMap().keys());
	setNextBossPresence(client);
	watchPresence(client);

	for (const timestamp of bossTimestamps) {
		scheduleJob(new Date(timestamp), () => {
			setNextBossPresence(client);
		});
	}
};
