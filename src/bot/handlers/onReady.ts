import { Client } from 'discord.js';
import { CHANNEL_ID } from '../../const.js';
import { getChannel } from '../../lib/discord.js';
import { timeString } from '../../lib/dates.js';
import { GuildMemberId, watchStatus } from '../../lib/watchStatus.js';

import { Status } from '../../lib/watchStatus.js';
import { bossSubscriptionsModule } from '../../modules/bossSubscriptions/bossSubscriptions.js';
import { bossScheduleModule } from '../../modules/bossSchedule/mod.js';
import { presenceModule } from '../../modules/presence/mod.js';

export const onReady = async (client: Client) => {
	const vinnieMainChannel = getChannel(client, CHANNEL_ID);
	try {
		console.log(`${timeString()} Ready!`);

		presenceModule.schedulePresenceUpdate(client);

		const subscriptions = await bossSubscriptionsModule.getChannels();
		bossScheduleModule.scheduleForChannels(client, subscriptions);

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
