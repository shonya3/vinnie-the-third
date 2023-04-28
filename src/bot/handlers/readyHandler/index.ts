import { timeString } from '../../../lib/dates.js';
import { Client } from 'discord.js';
import bossSubscriptionsModule from '../../../modules/bossSubscriptions/mod.js';
import bossScheduleModule from '../../../modules/bossSchedule/mod.js';
import presenceModule from '../../../modules/presence/mod.js';
import commandsModule from '../../../modules/commands/mod.js';
import { BossSubscriptionForChannel } from '../../../types.js';
import { getChannel } from '../../../lib/discord.js';
import { CHANNEL_ID } from '../../../const.js';
import { GuildMemberId, watchStatus, Status } from '../../../lib/watchStatus.js';

export const readyHandler = async (client: Client) => {
	const vinnieMainChannel = getChannel(client, CHANNEL_ID);
	try {
		console.log(`${timeString()} Ready!`);

		presenceModule.schedulePresenceUpdate(client);

		const subscriptions: BossSubscriptionForChannel[] = await bossSubscriptionsModule.getChannels();
		bossScheduleModule.scheduleForChannels(client, subscriptions);

		commandsModule.loadCommands(import.meta.url, '../../commands').then(commands => {
			commandsModule.putCommandsIntoCollection(commands, client.commands);
		});

		const kroiya: GuildMemberId = {
			guildId: '356012941083934721',
			memberId: '182893458858442762',
		};

		watchStatus(client, kroiya)
			.log('kroiya')
			.on(Status.Online, () => vinnieMainChannel.send(':rabbit: пришел'))
			.on(Status.Offline, () => vinnieMainChannel.send(':rabbit: ушел'));
	} catch (err) {
		console.log(err);
		console.log('Error from Ready Handler');
	}
};
