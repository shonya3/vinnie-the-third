import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
import bossSubscriptionsController from '../../controllers/bossSubscriptions/bossSubscriptions.controller.js';
import bossScheduleController from '../../controllers/bossSchedule/bossSchedule.controller.js';

export const command = {
  data: new SlashCommandBuilder().setName('subscriptions').setDescription('Проверить подписку на боссов'),

  async execute(interaction: CommandInteraction, client: Client) {
    const { channelId } = interaction;

    const subscription = await bossSubscriptionsController.getOneChannel(channelId);

    if (!subscription) {
      bossScheduleController.cancelForOneChannel(client, channelId);
      return interaction.reply('Вы не подписаны на анонс боссов.');
    }

    if (subscription && !client.jobs.has(channelId)) {
      bossScheduleController.scheduleForOneChannel(client, subscription);
    }

    return interaction.reply(`Вы подписаны на оповещения за ${subscription.offsets.join(', ')} минут до босса`);
  },
};
