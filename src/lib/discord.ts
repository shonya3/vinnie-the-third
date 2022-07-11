import { Client, Message, Snowflake, TextChannel, ThreadChannel } from 'discord.js';
import MessageFetcher from './MessageFetcher.js';
import { ALL_MESSAGES, CHANNEL_ID, DISCORD_EPOCH } from '../const.js';
import { waitMinutes } from './dates.js';
import { concatStringsToLength } from './general.js';

export const createChannelHistoryGenerator = (channel: TextChannel) =>
  new MessageFetcher(channel).first(ALL_MESSAGES).asGenerator();
export const getChannel = (client: Client, id: string = CHANNEL_ID) => client.channels.cache.get(id) as TextChannel;
export const getThread = (channel: TextChannel, id: string) => channel.threads.cache.get(id);

export const dateToSnowflake = (timestamp: number | Date) => {
  let ts = typeof timestamp === 'number' ? timestamp : timestamp.getTime();
  const ms = ts - DISCORD_EPOCH;
  const shifted = BigInt(ms) << BigInt(22);
  return String(Number(shifted) + 2 ** 22 - 1);
};
export const snowflakeToTimestamp = (id: Snowflake) => {
  return Number(BigInt(id) >> 22n) + DISCORD_EPOCH;
};
export const snowflakeToDate = (id: Snowflake) => {
  return new Date(snowflakeToTimestamp(id));
};

export const formatMessage = (msg: Message, i?: number) => {
  if (i !== undefined)
    return `${String(++i).padStart(3)}. ${msg.id} ${msg.author.username}(${new Date(
      msg.createdAt ?? msg.createdTimestamp
    ).toLocaleString('ru')}): ${msg.content}`;

  const name = `${msg.author.username}`;
  const dateString = `(${new Date(msg.createdAt ?? msg.createdTimestamp).toLocaleString('ru')})`;

  const beforeContent = concatStringsToLength(name, dateString, 36);

  return `${beforeContent}: ${msg.content}`;
};
export const sendSelfDeletingMessage = async (channel: TextChannel, str: string, minutes = 5) => {
  try {
    const msg = await channel.send(str);
    await waitMinutes(minutes);
    await msg.delete();
  } catch (err) {
    console.log(err);
    console.log('Error. Tried to sendSelfDeingMessage');
  }
};
export const createThread = (channel: TextChannel, name: string) => channel.threads.create({ name });

const cache = new Map<string, string>();
export const writeToThread = async (channel: TextChannel, name: string, str: string) => {
  try {
    if (cache.has(name)) {
      console.log('cached');
      const id = cache.get(name);
      if (!id) throw new Error('No thread id');
      const thread = getThread(channel, id);
      if (!thread) throw new Error('No thread');
      await thread.send(str);
      return thread;
    }

    const { threads } = await channel.threads.fetchActive();
    const filteredThreads = Array.from(threads.values()).filter(t => t.name === name);
    let thread: ThreadChannel = Object.create({});
    switch (filteredThreads.length) {
      case 0: {
        thread = await createThread(channel, name);
        break;
        // await thread.send(str);
        // cache.set(name, thread.id);
        // return thread;
      }
      case 1: {
        thread = filteredThreads[0];
        break;
        // await thread.send(str);
        // cache.set(name, thread.id);
        // return thread;
      }
      default: {
        thread = filteredThreads.sort((a, b) => {
          if (!b.createdTimestamp || !a.createdTimestamp) throw new Error('No createdTimestamp for thread');
          return b.createdTimestamp - a.createdTimestamp;
        })[0];
        break;
        // await thread.send(str);
        // cache.set(name, thread.id);
        // return thread;
      }
    }
    cache.set(name, thread.id);
    await thread.send(str);
    return thread;
  } catch (err) {
    console.log(`Error in writeThread`, err);
  }
};

export const setPresence = function (client: Client, str: string) {
  return client.user!.setPresence({
    activities: [{ name: str }],
  });
};

export const getPresence = (client: Client) => client.user!.presence.activities[0].name;
