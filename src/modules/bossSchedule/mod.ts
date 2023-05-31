import { Client } from 'discord.js';
import { putAnnouncementIntoCollection } from './putAnnouncementIntoCollection.js';
import type { BossSubscriptionForChannel } from '../../types.js';
import { setNextBossPresence } from '../presence/setNextBossPresence.js';
import { scheduleBossAnnoucements } from './scheduleBossAnnouncements.js';

const scheduleForOneChannel = (client: Client, { channelId, offsets }: BossSubscriptionForChannel) => {
	for (const announcement of scheduleBossAnnoucements(offsets, channelId, client)) {
		putAnnouncementIntoCollection(announcement, channelId, client.announcements);
	}
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

export const bossScheduleModule = {
	scheduleForOneChannel,
	cancelForOneChannel,
	scheduleForChannels,
	setNextBossPresence,
};
