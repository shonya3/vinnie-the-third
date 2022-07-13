import { Client } from 'discord.js';
import { announcementsFromTable } from './announcementsFromTable.js';
import { putAnnouncementIntoCollection } from './putAnnouncementIntoCollection.js';
import { scheduleBossAnnouncement } from './scheduleBossAnnouncement.js';
import type { BossSubscriptionForChannel } from '../../types.js';
import { setNextBossPresence } from '../presence/setNextBossPresence.js';
import { Announcement } from '../../lib/Announcement.js';

const scheduleForOneChannel = (client: Client, { channelId, offsets }: BossSubscriptionForChannel) => {
  announcementsFromTable(offsets).forEach((announcement: Announcement) => {
    const scheduled = scheduleBossAnnouncement(announcement, channelId, client);
    putAnnouncementIntoCollection(scheduled, channelId, client.announcements);
  });
};

const cancelForOneChannel = (client: Client, channelId: BossSubscriptionForChannel['channelId']) => {
  if (!client.announcements.has(channelId)) return;
  const announcements = client.announcements.get(channelId);
  if (!announcements) return;
  announcements.forEach(ann => ann.cancel());
  client.announcements.delete(channelId);
};

const scheduleForChannels = (client: Client, subscriptions: BossSubscriptionForChannel[]) => {
  subscriptions.forEach(sub => scheduleForOneChannel(client, sub));
};

export default {
  scheduleForOneChannel,
  cancelForOneChannel,
  scheduleForChannels,
  announcementsFromTable,
  setNextBossPresence,
};
