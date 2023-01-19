import { TextChannel } from 'discord.js';
import { scheduledJobs, scheduleJob } from 'node-schedule';
import { cronToClosestDate, dateToRule } from '../../lib/dates.js';
import { sendSelfDeletingMessage } from '../../lib/discord.js';
import { CronExpression } from '../../types.js';

const crons = [
	'0 3 * * 1',
	'0 12 * * 1',
	'0 21 * * 1',
	'0 6 * * 2',
	'0 15 * * 2',
	'0 0 * * 3',
	'0 9 * * 3',
	'0 18 * * 3',
	'0 3 * * 4',
	'0 12 * * 4',
	'0 21 * * 4',
	'0 6 * * 5',
	'0 15 * * 5',
	'0 0 * * 6',
	'0 9 * * 6',
	'0 18 * * 6',
	'0 3 * * 0',
	'0 12 * * 0',
	'0 18 * * 0',
] satisfies CronExpression[];

export const scheduleNotifications = (channel: TextChannel, crons: CronExpression[]) => {
	crons.forEach(cron => {
		const closestDate = new Date(cronToClosestDate(cron).getTime() - 3600 * 1000);
		const rule = dateToRule(closestDate, 'Europe/Kyiv');
		scheduleJob(rule, () => {
			sendSelfDeletingMessage(channel, `До возможного отключения света 1 час`, 300);
		});
	});
};

export const schedule = (channel: TextChannel) => {
	scheduleNotifications(channel, crons);
};

const electricityNotifacionModule = {
	schedule,
};

export default electricityNotifacionModule;
