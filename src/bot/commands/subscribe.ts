import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, TextChannel } from 'discord.js';
import { MAX_POSSIBLE_OFFSET, MIN_POSSIBLE_OFFSET } from '../../const.js';
import bossSubscriptionsController from '../../controllers/bossSubscriptions.controller.js';
import { getChannel } from '../../utils/discord.js';
import { unique } from '../../utils/general.js';
import { announcementsFromTable } from '../handlers/readyHandler/announcementsFromTable.js';
import { putJobIntoCollection } from '../handlers/readyHandler/putJobIntoCollection.js';
import { scheduleBossAnnouncement } from '../handlers/readyHandler/scheduleBossAnnouncement.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('subscribe')
    .setDescription('Подписывает на анонс боссов в текстовом канале')
    .addStringOption(option =>
      option
        .setName('за-сколько-минут-предупредить')
        .setDescription(
          `10,30 - пример. Возможные значения: от ${MIN_POSSIBLE_OFFSET} до ${MAX_POSSIBLE_OFFSET}. Сколько угодно значений через запятую. `
        )
        .setRequired(true)
    ),

  async execute(interaction: CommandInteraction, client: Client) {
    const { channelId } = interaction;

    const subscription = await bossSubscriptionsController.getOneChannel(channelId);
    if (subscription) {
      if (!client.jobs.has(channelId)) {
        const channel = getChannel(client, subscription.channelId);
        announcementsFromTable(subscription.offsets).forEach(announcement => {
          const job = scheduleBossAnnouncement(announcement, channel.id, client, subscription.offsets);
          putJobIntoCollection(job, channelId, client.jobs);
        });
      }

      return interaction.reply('Вы уже подписаны. Сначала отпишитесь от старых анонсов.');
    }
    const offsetsFromUserInput = interaction.options.getString('за-сколько-минут-предупредить');
    if (!offsetsFromUserInput)
      return interaction.reply('Не смог получить данные. Возможно, вы ввели некорректные данные. Попробуйте еще раз. ');
    const offsets = unique(
      offsetsFromUserInput
        .split(',')
        .map(offset => parseInt(offset))
        .filter(offset => Number.isInteger(offset))
    );
    if (Math.max(...offsets) > MAX_POSSIBLE_OFFSET || Math.min(...offsets) < MIN_POSSIBLE_OFFSET)
      return interaction.reply(`Допустимые значения: от ${MIN_POSSIBLE_OFFSET} до ${MAX_POSSIBLE_OFFSET}`);

    const newSubscription = await bossSubscriptionsController.saveSubscription(channelId, offsets);

    const channel = getChannel(client, newSubscription.channelId);
    announcementsFromTable(newSubscription.offsets).forEach(announcement => {
      const job = scheduleBossAnnouncement(announcement, channel.id, client, newSubscription.offsets);
      putJobIntoCollection(job, channelId, client.jobs);
    });

    return interaction.reply(
      `Вы успешно подписались на оповещения за ${newSubscription.offsets.join(', ')} минут до босса`
    );
  },
};
