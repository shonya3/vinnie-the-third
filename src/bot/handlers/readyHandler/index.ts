import { timeString } from './../../../utils/dates.js';
import { Client } from 'discord.js';
import { loadCommands } from '../../../loadCommands.js';
import { announcementsFromTable } from './announcementsFromTable.js';
import { scheduleBossAnnouncement } from './scheduleBossAnnouncement.js';
import bossSubscriptionsController from '../../../controllers/bossSubscriptions.controller.js';
import { putJobIntoCollection } from './putJobIntoCollection.js';
import { putCommandsIntoCollection } from './putCommandsIntoCollection.js';
import { schedulePresenceUpdate } from './schedulePresenceUpdate.js';

export const readyHandler = async (client: Client) => {
  try {
    console.log(`${timeString(new Date())} Ready!`);

    schedulePresenceUpdate(client);

    const subscriptions = await bossSubscriptionsController.getChannels();

    subscriptions.forEach(({ channelId, offsets }) => {
      announcementsFromTable(offsets).forEach(announcement => {
        const job = scheduleBossAnnouncement(announcement, channelId, client);
        putJobIntoCollection(job, channelId, client.jobs);
      });
    });

    loadCommands(import.meta.url, '../../commands').then(commands => {
      putCommandsIntoCollection(commands, client.commands);
    });
  } catch (err) {
    console.log(err);
    console.log('Error from Ready Handler');
  }
};
