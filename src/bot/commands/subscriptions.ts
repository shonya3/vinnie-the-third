import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, ChatInputCommandInteraction } from 'discord.js';
import bossScheduleModule from '../../modules/bossSchedule/mod.js';
import { bossSubscriptionsModule } from '../../modules/bossSubscriptions/bossSubscriptions.js';

export const subscriptions = {
	data: new SlashCommandBuilder().setName('subscriptions').setDescription('Проверить подписку на боссов'),

	async execute(interaction: ChatInputCommandInteraction, client: Client) {
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
