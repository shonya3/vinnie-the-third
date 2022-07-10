import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
import bossSubscriptionsController from '../../controllers/bossSubscriptions.controller.js';

export const command = {
  data: new SlashCommandBuilder().setName('unsubscribe').setDescription('Отписаться от анонса боссов'),

  async execute(interaction: CommandInteraction, client: Client) {
    const { channelId } = interaction;
    const jobs = client.jobs.get(channelId);

    const subscription = await bossSubscriptionsController.getOneChannel(channelId);
    if (!subscription) return interaction.reply('Вы не подписаны на анонс боссов');

    try {
      bossSubscriptionsController.deleteChannel(channelId);
      jobs?.forEach(j => j.cancel());
      client.jobs.delete(channelId);
    } catch (err) {
      console.log(err);
      return interaction.reply('Произошла ошибка при попытке отписаться. Попробуйте снова.');
    }

    return interaction.reply('Вы отписались от анонса боссов');
  },
};
