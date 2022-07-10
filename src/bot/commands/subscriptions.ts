import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
import bossSubscriptionsController from '../../controllers/bossSubscriptions.controller.js';

export const command = {
  data: new SlashCommandBuilder().setName('subscriptions').setDescription('Проверить подписку на боссов'),

  async execute(interaction: CommandInteraction, client: Client) {
    const { channelId } = interaction;

    const subscription = await bossSubscriptionsController.getOneChannel(channelId);

    if (!subscription) {
      const jobs = client.jobs.get(channelId);
      jobs?.forEach(j => j.cancel());
      client.jobs.delete(channelId);
      return interaction.reply('Вы не подписаны на анонс боссов.');
    }

    return interaction.reply(`Вы подписаны на оповещения за ${subscription.offsets.join(', ')} минут до босса`);
  },
};
