import type { ChatInputCommandInteraction, Client } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import bossScheduleModule from '../../modules/bossSchedule/mod.js';
import { bossSubscriptionsModule } from '../../modules/bossSubscriptions/bossSubscriptions.js';

export const unsubscribe = {
	data: new SlashCommandBuilder().setName('unsubscribe').setDescription('Отписаться от анонса боссов'),

	async execute(interaction: ChatInputCommandInteraction, client: Client) {
		const { channelId } = interaction;

		try {
			const subscription = await bossSubscriptionsModule.getOneChannel(channelId);
			if (!subscription) {
				bossScheduleModule.cancelForOneChannel(client, channelId);
				return interaction.reply('Вы не подписаны на анонс боссов');
			}

			bossSubscriptionsModule.deleteChannel(channelId);
			bossScheduleModule.cancelForOneChannel(client, channelId);
		} catch (err) {
			console.log(err);
			return interaction.reply('Произошла ошибка при попытке отписаться. Попробуйте снова.');
		}

		return interaction.reply('Вы отписались от анонса боссов');
	},
};
