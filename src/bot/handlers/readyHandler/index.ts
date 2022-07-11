import { timeString } from '../../../lib/dates.js';
import { Client } from 'discord.js';
import bossSubscriptionsController from '../../../controllers/bossSubscriptions/bossSubscriptions.controller.js';
import bossScheduleController from '../../../controllers/bossSchedule/bossSchedule.controller.js';
import presenceController from '../../../controllers/presence/presence.controller.js';
import commandsController from '../../../controllers/commands/commands.controller.js';
import { BossSubscriptionForChannel } from '../../../types.js';

export const readyHandler = async (client: Client) => {
  try {
    console.log(`${timeString(new Date())} Ready!`);

    presenceController.schedulePresenceUpdate(client);

    const subscriptions: BossSubscriptionForChannel[] = await bossSubscriptionsController.getChannels();
    bossScheduleController.scheduleForManyChannels(client, subscriptions);

    commandsController.loadCommands(import.meta.url, '../../commands').then(commands => {
      commandsController.putCommandsIntoCollection(commands, client.commands);
    });
  } catch (err) {
    console.log(err);
    console.log('Error from Ready Handler');
  }
};
