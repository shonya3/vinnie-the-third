import { Client, Intents } from 'discord.js';
import { Collection } from '@discordjs/collection';

import { readyHandler } from './handlers/readyHandler/index.js';
import { interactionHandler } from './handlers/interactionHandler/index.js';
import { messageHandler } from './handlers/messageHandler/index.js';
import { CHANNEL_ID } from '../const.js';
import { getChannel, writeToThread } from '../utils/discord.js';
import { setNextBossPresence } from './handlers/readyHandler/setNextBossPresence.js';
import { createThread } from '../utils/discord.js';
import { getThread } from '../utils/discord.js';

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  ],
});

client.commands = new Collection();
client.jobs = new Collection();

client.on('ready', async () => {
  readyHandler(client);
  const vinnieMainChannel = getChannel(client, CHANNEL_ID);
  const vinnieArcherChannel = getChannel(client, '356013349496029184');
  const wsChannel = getChannel(client, '842131980538871878');
});
client.on('interactionCreate', interaction => interactionHandler(interaction, client));
client.on('messageCreate', messageHandler);

export default client;
