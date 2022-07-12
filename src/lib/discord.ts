import { Client, Message, Snowflake, TextChannel, ThreadChannel } from 'discord.js';
import MessageFetcher from './MessageFetcher.js';
import { ALL_MESSAGES, CHANNEL_ID, DISCORD_EPOCH } from '../const.js';
import { waitMinutes } from './dates.js';
import { concatStringsToLength } from './general.js';

export const createChannelHistoryGenerator = (channel: TextChannel) =>
  new MessageFetcher(channel).first(ALL_MESSAGES).asGenerator();
export const getChannel = (client: Client, id: string = CHANNEL_ID) => client.channels.cache.get(id) as TextChannel;
export const getThread = (channel: TextChannel, id: string) => channel.threads.cache.get(id);

/**
 * Converts Date to Snowflake
 * @param timestamp timestamp or date
 * @returns Snowflake (discord id string) https://discord.com/developers/docs/reference
 * 
 * ```js
 *  const resultSnowflake = dateToSnowflake(new Date(2022, 6, 12, 1, 51));
    const abs = Math.abs(snowflakeToDate(resultSnowflake).getTime() - new Date(2022, 6, 12, 1, 51).getTime());
    expect(abs).lessThanOrEqual(1000 * 60 * 5);
    ```
 */
export const dateToSnowflake = (timestamp: number | Date): Snowflake => {
  let ts = typeof timestamp === 'number' ? timestamp : timestamp.getTime();
  const ms = ts - DISCORD_EPOCH;
  const shifted = BigInt(ms) << BigInt(22);
  return String(Number(shifted) + 2 ** 22 - 1);
};

/**
 * Converts Snowflake to timestamp
 * @param id Snowflake (discord id string) https://discord.com/developers/docs/reference
 * @returns timestamp
 * 
 * ```js
 *  const resultTimestamp = snowflakeToTimestamp('996187094517039197');
    const abs = Math.abs(resultTimestamp - new Date(2022, 6, 12, 1, 51).getTime());
    expect(abs).lessThanOrEqual(1000 * 60);
    ```
 */
export const snowflakeToTimestamp = (id: Snowflake): number => {
  return Number(BigInt(id) >> 22n) + DISCORD_EPOCH;
};

/**
 * Converts Snowflake to Date
 * @param id Snowflake (discord id string) https://discord.com/developers/docs/reference
 * @returns Date
 */
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

/**
 * Send message to channel, wait minutes, then delete
 * @param channel
 * @param str string content
 * @param minutes defaults to 5 min. If you need seconds, just pass 1/60
 */
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
/**
 * Find thread in channel with name and send str to it. If no thread, create first.
 * If more than one thread with given name, send to latest created one.
 * Uses caching for threads ids.
 * @param channel
 * @param name thread name
 * @param str content string
 */
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
      }
      case 1: {
        thread = filteredThreads[0];
        break;
      }
      default: {
        thread = filteredThreads.sort((a, b) => {
          if (!b.createdTimestamp || !a.createdTimestamp) throw new Error('No createdTimestamp for thread');
          return b.createdTimestamp - a.createdTimestamp;
        })[0];
        break;
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

if (import.meta.vitest) {
  const { it, expect, describe, vi } = import.meta.vitest;
  const { waitSeconds } = await import('./dates.js');

  // describe.concurrent('async', () => {
  //   it('test async', async () => {
  //     expect(await waitSeconds(3).then(() => 5)).toBe(5);
  //   });

  //   it('test async', async () => {
  //     expect(await waitSeconds(3).then(() => 5)).toBe(5);
  //   });
  // });

  it('dateToSnowflake', () => {
    const resultSnowflake = dateToSnowflake(new Date(2022, 6, 12, 1, 51));
    const abs = Math.abs(snowflakeToDate(resultSnowflake).getTime() - new Date(2022, 6, 12, 1, 51).getTime());
    expect(abs).lessThanOrEqual(1000 * 60 * 5);
  });
  it('snowflakeToTimestamp', () => {
    const resultTimestamp = snowflakeToTimestamp('996187094517039197');
    const abs = Math.abs(resultTimestamp - new Date(2022, 6, 12, 1, 51).getTime());
    expect(abs).lessThanOrEqual(1000 * 60);
  });
  it('snowflakeToDate', () => {
    const resultDate = snowflakeToDate('996187094517039197');
    const abs = Math.abs(resultDate.getTime() - new Date(2022, 6, 12, 1, 51).getTime());
    expect(abs).lessThanOrEqual(1000 * 60 * 5);

    const resultDate2 = snowflakeToDate('942715640861569025');
    const abs2 = Math.abs(resultDate2.getTime() - new Date(2022, 1, 14, 12, 34).getTime());
    expect(abs2).lessThanOrEqual(1000 * 60 * 5);
  });
  it('sendSelfDeletingMessage', async () => {
    const msg = { delete: vi.fn() } as unknown as Message;
    const channel = { send: vi.fn(() => msg) } as unknown as TextChannel;
    await sendSelfDeletingMessage(channel, 'str', 1 / (60 * 1000));
    expect(channel.send).toBeCalledTimes(1);
    expect(msg.delete).toBeCalledTimes(1);
  });
  describe('writeToThread', () => {
    it.todo('tests');
  });
}
