import { Client } from 'discord.js';
import { announcementsFromTable } from '../../models/bossSchedule/announcementsFromTable.js';
import { putJobIntoCollection } from './putJobIntoCollection.js';
import { scheduleBossAnnouncement } from './scheduleBossAnnouncement.js';
import type { BossSubscriptionForChannel } from '../../types.js';

const scheduleForOneChannel = (client: Client, { channelId, offsets }: BossSubscriptionForChannel) => {
  announcementsFromTable(offsets).forEach(announcement => {
    const job = scheduleBossAnnouncement(announcement, channelId, client);
    putJobIntoCollection(job, channelId, client.jobs);
  });
};

const cancelForOneChannel = (client: Client, channelId: BossSubscriptionForChannel['channelId']) => {
  if (!client.jobs.has(channelId)) return;
  const jobs = client.jobs.get(channelId);
  if (!jobs) return;
  jobs.forEach(j => j.cancel());
  client.jobs.delete(channelId);
};

const scheduleForManyChannels = (client: Client, subscriptions: BossSubscriptionForChannel[]) => {
  subscriptions.forEach(sub => scheduleForOneChannel(client, sub));
};

export default {
  scheduleForOneChannel,
  cancelForOneChannel,
  scheduleForManyChannels,
};
