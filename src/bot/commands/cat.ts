import { CommandInteraction, ChatInputCommandInteraction } from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';

export const cat = {
	data: new SlashCommandBuilder().setName('cat').setDescription('Random cat picture'),
	async execute(interaction: ChatInputCommandInteraction) {
		try {
			const url = await fetch('https://api.thecatapi.com/v1/images/search')
				.then(res => res.json())
				.then(data => data[0].url);
			return interaction.reply(url);
		} catch (err) {
			console.log('Error from cat command');
			console.log(err);
		}
	},
};
