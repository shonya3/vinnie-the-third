import { Client, GatewayIntentBits } from 'discord.js';
import { Collection } from '@discordjs/collection';

import { readyHandler } from './handlers/readyHandler/index.js';
import { interactionHandler } from './handlers/interactionHandler/index.js';
import { messageHandler } from './handlers/messageHandler/index.js';
import { CHANNEL_ID } from '../const.js';
import { getChannel } from '../lib/discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.announcements = new Collection();

client.on('ready', async () => {
  await readyHandler(client);
  const vinnieMainChannel = getChannel(client, CHANNEL_ID);
  const vinnieArcherChannel = getChannel(client, '356013349496029184');
  const wsChannel = getChannel(client, '842131980538871878');
});
client.on('interactionCreate', interaction => interactionHandler(interaction, client));
client.on('messageCreate', messageHandler);

export default client;
