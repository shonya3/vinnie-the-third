import { Collection } from 'discord.js';
import { Announcement } from '../../lib/Announcement.js';

export const putAnnouncementIntoCollection = (
	announcement: Announcement,
	channelId: string,
	collection: Collection<string, Announcement[]>
) => {
	const arr = collection.get(channelId);
	arr ? arr.push(announcement) : collection.set(channelId, [announcement]);
};
