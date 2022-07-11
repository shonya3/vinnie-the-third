import type { Client, CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import bossScheduleController from '../../controllers/bossSchedule/bossSchedule.controller.js';
import bossSubscriptionsController from '../../controllers/bossSubscriptions/bossSubscriptions.controller.js';

export const command = {
  data: new SlashCommandBuilder().setName('unsubscribe').setDescription('Отписаться от анонса боссов'),

  async execute(interaction: CommandInteraction, client: Client) {
    const { channelId } = interaction;

    try {
      const subscription = await bossSubscriptionsController.getOneChannel(channelId);
      if (!subscription) {
        bossScheduleController.cancelForOneChannel(client, channelId);
        return interaction.reply('Вы не подписаны на анонс боссов');
      }

      bossSubscriptionsController.deleteChannel(channelId);
      bossScheduleController.cancelForOneChannel(client, channelId);
    } catch (err) {
      console.log(err);
      return interaction.reply('Произошла ошибка при попытке отписаться. Попробуйте снова.');
    }

    return interaction.reply('Вы отписались от анонса боссов');
  },
};
