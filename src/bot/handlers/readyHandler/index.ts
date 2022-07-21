import { timeString } from '../../../lib/dates.js';
import { Client } from 'discord.js';
import bossSubscriptionsController from '../../../controllers/bossSubscriptions/bossSubscriptions.controller.js';
import bossScheduleController from '../../../controllers/bossSchedule/bossSchedule.controller.js';
import presenceController from '../../../controllers/presence/presence.controller.js';
import commandsController from '../../../controllers/commands/commands.controller.js';
import { BossSubscriptionForChannel } from '../../../types.js';
import { CHANNEL_ID } from '../../../const.js';

export const readyHandler = async (client: Client) => {
  try {
    console.log(`${timeString(new Date())} Ready!`);
    // const ch = await client.channels.fetch(CHANNEL_ID);
    const ch = client.channels.cache.get(CHANNEL_ID);
    console.log(ch);

    presenceController.schedulePresenceUpdate(client);

    const subscriptions: BossSubscriptionForChannel[] = await bossSubscriptionsController.getChannels();
    bossScheduleController.scheduleForChannels(client, subscriptions);

    commandsController.loadCommands(import.meta.url, '../../commands').then(commands => {
      commandsController.putCommandsIntoCollection(commands, client.commands);
    });
  } catch (err) {
    console.log(err);
    console.log('Error from Ready Handler');
  }
};
