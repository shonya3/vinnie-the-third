import { ChatInputCommandInteraction } from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';

export const ping = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Pong!'),
	async execute(interaction: ChatInputCommandInteraction) {
		return interaction.reply('Pong!');
	},
};
