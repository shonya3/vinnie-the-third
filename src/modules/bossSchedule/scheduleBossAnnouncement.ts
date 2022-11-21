import { bold } from '@discordjs/builders';
import { Client } from 'discord.js';
import { RELEASE_MESSAGE_TIMEOUT } from '../../const.js';
import { getChannel, sendSelfDeletingMessage } from '../../lib/discord.js';
import type { Announcement } from '../../lib/Announcement.js';
import { Offset, ScheduledAnnouncement } from '../../types.js';

export const scheduleBossAnnouncement = (
  announcement: Announcement,
  channelId: string,
  client: Client,
  offsets?: Offset[]
) => {
  if (offsets) announcement.offsets = offsets;

  const channel = getChannel(client, channelId);

  const bossName = announcement.getContext('bossName');
  if (!bossName) throw new Error('bossName should be set');

  announcement.schedule({
    repeating: (offset, timeout) =>
      sendSelfDeletingMessage(channel, `Через ${offset} минут ${bold(bossName)}!`, timeout),
    onRelease: () => sendSelfDeletingMessage(channel, `Босс ${bossName} только что появился!`, RELEASE_MESSAGE_TIMEOUT),
  });

  return announcement;
};
