import { bold } from '@discordjs/builders';
import { Client } from 'discord.js';
import { RELEASE_MESSAGE_TIMEOUT } from '../../const.js';
import { getChannel, sendSelfDeletingMessage } from '../../lib/discord.js';
import type { Announcement } from '../../lib/Announcement.js';

export const scheduleBossAnnouncement = (
  announcement: Announcement,
  channelId: string,
  client: Client,
  offsets?: Array<number>
) => {
  if (offsets) announcement.offsets = offsets;

  const channel = getChannel(client, channelId);

  const bossName = announcement.getContext('bossName');
  if (!bossName) throw new Error('bossName should be set');

  announcement.setRepeatingCallback(async (offset, timeout) => {
    await sendSelfDeletingMessage(channel, `Через ${offset} минут ${bold(bossName)}!`, timeout);
  });
  announcement.setReleaseCallback(async () => {
    await sendSelfDeletingMessage(channel, `Босс ${bossName} только что появился!`, RELEASE_MESSAGE_TIMEOUT);
  });

  const job = announcement.schedule();
  return job;
};
