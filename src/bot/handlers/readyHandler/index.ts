import { timeString } from '../../../lib/dates.js';
import { Client } from 'discord.js';
import bossSubscriptionsModule from '../../../modules/bossSubscriptions/mod.js';
import bossScheduleModule from '../../../modules/bossSchedule/mod.js';
import presenceModule from '../../../modules/presence/mod.js';
import commandsModule from '../../../modules/commands/mod.js';
import { BossSubscriptionForChannel } from '../../../types.js';
import kroiyaStatusWatcher from '../../../modules/kroiyaStatusWatcher.js';

export const readyHandler = async (client: Client) => {
	try {
		console.log(`${timeString()} Ready!`);

		presenceModule.schedulePresenceUpdate(client);

		const subscriptions: BossSubscriptionForChannel[] = await bossSubscriptionsModule.getChannels();
		bossScheduleModule.scheduleForChannels(client, subscriptions);

		commandsModule.loadCommands(import.meta.url, '../../commands').then(commands => {
			commandsModule.putCommandsIntoCollection(commands, client.commands);
		});

		kroiyaStatusWatcher.init(client);
	} catch (err) {
		console.log(err);
		console.log('Error from Ready Handler');
	}
};
