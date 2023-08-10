import { SlashCommandBuilder, bold, ChatInputCommandInteraction } from 'discord.js';
import { generateBossMap } from '../../modules/bossSchedule/generateBossMap.js';
import { bossesString } from './mod.js';

const builder = new SlashCommandBuilder()
	.setName('next')
	.setDescription('Подсказывает имя ближайшего босса или ближайших боссов');
builder.addIntegerOption(option => option.setName('n').setDescription('n next bosses'));

export const next = {
	data: builder,
	async execute(interaction: ChatInputCommandInteraction) {
		const bossCount = interaction.options.getInteger('n') ?? 1;

		if (bossCount === 0) return interaction.reply('Возможно, это запятая или ноль');

		if (bossCount < 1) return interaction.reply('Введите положительное число');

		const replyString = bossesString(generateBossMap({ nameStyle: 'full' }), bossCount);

		return interaction.reply(replyString);
	},
};
