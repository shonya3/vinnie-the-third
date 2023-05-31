import { bold } from '@discordjs/builders';
import { Client } from 'discord.js';
import { RELEASE_MESSAGE_TIMEOUT } from '../../const.js';
import { getChannel, sendSelfDeletingMessage } from '../../lib/discord.js';
import { Announcement } from '../../lib/Announcement.js';
import { table } from './table.js';

export const scheduleBossAnnoucements = (offsets: number[], channelId: string, client: Client): Announcement[] => {
	const announcements: Announcement[] = [];
	const channel = getChannel(client, channelId);
	for (const boss of table) {
		for (const cron of boss.cronExpressions) {
			const announcement = new Announcement(cron, offsets);
			announcement.schedule(
				{
					repeating(offset, timeout) {
						return sendSelfDeletingMessage(channel, `Через ${offset} минут ${bold(boss.name)}!`, timeout);
					},
					onRelease() {
						return sendSelfDeletingMessage(
							channel,
							`Босс ${boss.name} только что появился!`,
							RELEASE_MESSAGE_TIMEOUT
						);
					},
				},
				boss.name
			);
			announcements.push(announcement);
		}
	}

	return announcements;
};
