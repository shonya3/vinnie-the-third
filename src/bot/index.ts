import { ChatInputCommandInteraction, Client, GatewayIntentBits } from 'discord.js';
import { Collection } from '@discordjs/collection';

import { CHANNEL_ID } from '../const.js';
import { getChannel } from '../lib/discord.js';
import { onMessage } from './handlers/onMessage.js';
import { onReady } from './handlers/onReady.js';
import { onInteraction } from './handlers/onInteraction.js';

const VINNIE_MAIN_CHANNEL = CHANNEL_ID;
const VINNIE_ARCHER_CHANNEL = '356013349496029184';
const WORKING_SERVER_CHANNEL = '842131980538871878';

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
	],
});

client.announcements = new Collection();

client.on('ready', onReady);
client.on('interactionCreate', interaction => onInteraction(interaction as ChatInputCommandInteraction, client));
client.on('messageCreate', onMessage);
