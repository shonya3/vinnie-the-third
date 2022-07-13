import { Collection } from 'discord.js';
import { ScheduledAnnouncement } from '../../types.js';

export const putAnnouncementIntoCollection = (
  announcement: ScheduledAnnouncement,
  channelId: string,
  collection: Collection<string, ScheduledAnnouncement[]>
) => {
  const arr = collection.get(channelId);
  arr ? arr.push(announcement) : collection.set(channelId, [announcement]);
};
