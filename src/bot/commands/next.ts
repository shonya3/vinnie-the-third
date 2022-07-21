import { SlashCommandBuilder, bold, ChatInputCommandInteraction } from 'discord.js';
import { timeLeft } from '../../lib/dates.js';
import { generateBossMap } from '../../models/bossSchedule/generateBossMap.js';

const createNextBossesString = (num = 1, map: Map<number | string, string[]>) =>
  Array.from(map.entries())
    .slice(0, num)
    .map(([timestamp, bosses]) => {
      const left = timeLeft(new Date(timestamp));
      return `${bold(bosses.join(', '))}. ${left}`;
    })
    .join('\n');

export const command = {
  data: new SlashCommandBuilder()
    .setName('next')
    .setDescription('Подсказывает имя ближайшего босса или ближайших боссов')
    .addIntegerOption(option => option.setName('n').setDescription('n next bosses')),
  async execute(interaction: ChatInputCommandInteraction) {
    const bossCount = interaction.options.getInteger('n') ?? 1;

    if (bossCount === 0) return interaction.reply('Возможно, это запятая или ноль');

    if (bossCount < 1) return interaction.reply('Введите положительное число');

    const replyString = createNextBossesString(bossCount, generateBossMap({ nameStyle: 'full' }));

    return interaction.reply(replyString);
  },
};
