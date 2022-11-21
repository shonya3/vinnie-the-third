import { TextChannel } from 'discord.js';
import { scheduledJobs, scheduleJob } from 'node-schedule';
import { cronToClosestDate, dateToRule } from '../../lib/dates.js';
import { sendSelfDeletingMessage } from '../../lib/discord.js';
import { CronExpression } from '../../types.js';

const crons: CronExpression[] = [
	'0 6 * * 1',
	'0 15 * * 1',
	'0 0 * * 2',
	'0 9 * * 2',
	'0 18 * * 2',
	'0 3 * * 3',
	'0 12 * * 3',
	'0 21 * * 3',
	'0 6 * * 4',
	'0 15 * * 4',
	'0 0 * * 5',
	'0 9 * * 5',
	'0 18 * * 5',
	'0 3 * * 6',
	'0 12 * * 6',
	'0 21 * * 6',
	'0 6 * * 0',
	'0 15 * * 0',
];

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
