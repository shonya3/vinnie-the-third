import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, TextChannel } from 'discord.js';
import { MAX_POSSIBLE_OFFSET, MIN_POSSIBLE_OFFSET } from '../../const.js';
import bossSubscriptionsController from '../../controllers/bossSubscriptions/bossSubscriptions.controller.js';
import { getChannel } from '../../lib/discord.js';
import { unique } from '../../lib/general.js';
import { announcementsFromTable } from '../../models/bossSchedule/announcementsFromTable.js';
import { putJobIntoCollection } from '../../controllers/bossSchedule/putJobIntoCollection.js';
import { scheduleBossAnnouncement } from '../../controllers/bossSchedule/scheduleBossAnnouncement.js';
import bossScheduleController from '../../controllers/bossSchedule/bossSchedule.controller.js';

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

    try {
      const subscription = await bossSubscriptionsController.getOneChannel(channelId);
      if (subscription) {
        bossScheduleController.scheduleForOneChannel(client, subscription);
        return interaction.reply('Вы уже подписаны. Сначала отпишитесь от старых анонсов.');
      }
      const offsetsFromUserInput = interaction.options.getString('за-сколько-минут-предупредить');
      if (!offsetsFromUserInput)
        return interaction.reply(
          'Не смог получить временные промежутки. Возможно, вы ввели некорректные данные. Попробуйте еще раз. '
        );
      const offsets = unique(
        offsetsFromUserInput
          .split(',')
          .map(offset => parseInt(offset))
          .filter(offset => Number.isInteger(offset))
      );
      if (Math.max(...offsets) > MAX_POSSIBLE_OFFSET || Math.min(...offsets) < MIN_POSSIBLE_OFFSET)
        return interaction.reply(`Допустимые значения: от ${MIN_POSSIBLE_OFFSET} до ${MAX_POSSIBLE_OFFSET}`);

      const newSubscription = await bossSubscriptionsController.saveSubscription(channelId, offsets);
      bossScheduleController.scheduleForOneChannel(client, newSubscription);

      return interaction.reply(
        `Вы успешно подписались на оповещения за ${newSubscription.offsets.join(', ')} минут до босса`
      );
    } catch (err) {
      console.log(err);
      return interaction.reply(`Ошибка при попытке подписаться. Попробуйте еще раз.`);
    }
  },
};
