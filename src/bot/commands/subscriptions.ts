import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
import bossSubscriptionsController from '../../controllers/bossSubscriptions.controller.js';
import { getChannel } from '../../utils/discord.js';
import { announcementsFromTable } from '../handlers/readyHandler/announcementsFromTable.js';
import { putJobIntoCollection } from '../handlers/readyHandler/putJobIntoCollection.js';
import { scheduleBossAnnouncement } from '../handlers/readyHandler/scheduleBossAnnouncement.js';

export const command = {
  data: new SlashCommandBuilder().setName('subscriptions').setDescription('Проверить подписку на боссов'),

  async execute(interaction: CommandInteraction, client: Client) {
    const { channelId } = interaction;

    const subscription = await bossSubscriptionsController.getOneChannel(channelId);

    if (!subscription) {
      if (client.jobs.has(channelId)) {
        const jobs = client.jobs.get(channelId);
        jobs?.forEach(j => j.cancel());
        client.jobs.delete(channelId);
      }
      return interaction.reply('Вы не подписаны на анонс боссов.');
    }

    if (!client.jobs.has(channelId)) {
      const channel = getChannel(client, subscription.channelId);
      announcementsFromTable(subscription.offsets).forEach(announcement => {
        const job = scheduleBossAnnouncement(announcement, channel.id, client, subscription.offsets);
        putJobIntoCollection(job, channelId, client.jobs);
      });
    }
    return interaction.reply(`Вы подписаны на оповещения за ${subscription.offsets.join(', ')} минут до босса`);
  },
};
