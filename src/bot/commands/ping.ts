import { CommandInteraction } from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';

export const command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setNameLocalizations({
      ru: 'пинг',
      'en-US': 'englishlocalization',
      'en-GB': 'englishlocalization',
    })
    .setDescription('Pong!')
    .setDescriptionLocalizations({
      ru: 'Понгает в ответ',
      'en-GB': 'Pongs, description localization',
      'en-US': 'Pongs, description localization',
    }),

  async execute(interaction: CommandInteraction) {
    return interaction.reply('Pong!');
  },
};
