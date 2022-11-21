import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { configENV } from './configENV.js';
import commandsModule from './modules/commands/mod.js';
import { SlashCommandBuilder } from 'discord.js';

const prodDeployCommands = (clientId: string, rest: REST, commands: Omit<SlashCommandBuilder, any>[]) =>
	rest.put(Routes.applicationCommands(clientId), { body: commands });

const devDeployCommands = (
	clientId: string,
	rest: REST,
	commands: Omit<SlashCommandBuilder, any>[],
	guilds: string[]
) =>
	Promise.all(
		guilds.map(guildId => rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands }))
	);

const deployCommands = async (token: string, clientId: string, guilds: string[], isProduction: boolean) => {
	try {
		const commands = await commandsModule.loadCommands(import.meta.url, './bot/commands');
		const commandsJSON: Omit<SlashCommandBuilder, any>[] = await Promise.all(
			commands.map(command => command.data.toJSON())
		);
		const rest = new REST({ version: '10' }).setToken(token);
		isProduction
			? await prodDeployCommands(clientId, rest, commandsJSON)
			: await devDeployCommands(clientId, rest, commandsJSON, guilds);
		console.log('--- FROM deploy.ts --- Successfully registered application commands');
	} catch (err) {
		console.error(err);
		console.log('Error on deployCommands.ts');
	}
};

configENV();

const isProduction = process.env.NODE_ENV === 'production';
console.log(`--- FROM deploy.ts --- process.env.NODE_ENV = ${process.env.NODE_ENV}`);

// process.env.GUILDS looks like 123213412412,213213213211
deployCommands(process.env.TOKEN, process.env.APPID, process.env.GUILDS.split(','), isProduction);
