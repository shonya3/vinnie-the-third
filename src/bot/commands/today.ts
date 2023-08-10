import { SlashCommandBuilder, bold, ChatInputCommandInteraction } from 'discord.js';
import { generateTodayBossMap } from '../../modules/bossSchedule/generateBossMap.js';
import { bossesString } from './mod.js';

export const today = {
	data: new SlashCommandBuilder().setName('today').setDescription('Список сегодняшних боссов'),
	async execute(interaction: ChatInputCommandInteraction) {
		return interaction.reply(bossesString(generateTodayBossMap({ nameStyle: 'full' })));
	},
};
