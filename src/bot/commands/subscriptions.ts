import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
import bossSubscriptionsModule from '../../modules/bossSubscriptions/mod.js';
import bossScheduleModule from '../../modules/bossSchedule/mod.js';

export const command = {
	data: new SlashCommandBuilder().setName('subscriptions').setDescription('Проверить подписку на боссов'),

	async execute(interaction: CommandInteraction, client: Client) {
		const { channelId } = interaction;

		const subscription = await bossSubscriptionsModule.getOneChannel(channelId);

		if (!subscription) {
			bossScheduleModule.cancelForOneChannel(client, channelId);
			return interaction.reply('Вы не подписаны на анонс боссов.');
		}

		if (subscription && !client.announcements.has(channelId)) {
			bossScheduleModule.scheduleForOneChannel(client, subscription);
		}

		return interaction.reply(`Вы подписаны на оповещения за ${subscription.offsets.join(', ')} минут до босса`);
	},
};
