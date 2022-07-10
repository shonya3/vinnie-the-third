import { Message, TextChannel } from 'discord.js';
import type { Snowflake } from 'discord.js';
import { capitalize } from '../../utils/general.js';

interface IMessageFetcher {
  before: (id: Snowflake, limit: number) => any;
  last: (limit: number) => Promise<Message[]> | any;
  after: (id: Snowflake, limit: number) => any;
}

interface Options {
  type: 'before' | 'after' | 'around';
}

const errorIdMessage = 'lastMessageId does not exist';

const getLastMessageId = (messages: Array<Message>) => {
  let lastMessageId = messages.at(-1)?.id;
  if (!lastMessageId) throw new Error(errorIdMessage);
  return lastMessageId;
};

export default class MessageFetcher implements IMessageFetcher {
  constructor(public channel: TextChannel) {}

  after(id: Snowflake, limit: number) {
    const self = this;

    const asGenerator = async function* () {
      let left = limit;
      let lastMessageId = id;
      let prevId = '';

      while (lastMessageId && lastMessageId !== prevId && left > 0) {
        const count = left <= 100 ? left : 100;
        try {
          let messages100 = await self.#simpleAfter(lastMessageId, count);
          messages100 = messages100.reverse();
          prevId = lastMessageId;
          lastMessageId = getLastMessageId(messages100);

          for (const msg of messages100) yield msg;

          left -= messages100.length;
        } catch (err: any) {
          if (err?.message === errorIdMessage) break;

          console.log(
            `Error from generator. Count: ${count}, left: ${left}, prevID: ${prevId}, lastMsgId: ${lastMessageId}`
          );
        }
      }
    };

    const asPromise = async () => {
      let messages: Message[] = [];
      let left = limit;
      let lastMessageId = id;
      let prevId = '';

      while (lastMessageId && lastMessageId !== prevId && left > 0) {
        const count = left <= 100 ? left : 100;
        try {
          const messages100 = await self.#simpleAfter(lastMessageId, count);
          messages100.reverse();
          prevId = lastMessageId;
          lastMessageId = getLastMessageId(messages100);
          messages.push(...messages100);

          left -= messages100.length;
        } catch (err: any) {
          if (err?.message === errorIdMessage) break;
          console.log(
            `Error from promise.  Count: ${count}, left: ${left}, prevID: ${prevId}, lastMsgId: ${lastMessageId}`
          );
        }
      }

      return messages;
    };

    return {
      asGenerator,
      asPromise,
    };
  }

  before(id: Snowflake, limit: number) {
    const self = this;

    const asGenerator = async function* () {
      let left = limit;
      let lastMessageId = id;
      let prevId = '';

      while (lastMessageId && lastMessageId !== prevId && left > 0) {
        const count = left <= 100 ? left : 100;
        try {
          const messages100 = await self.#simpleBefore(lastMessageId, count);
          prevId = lastMessageId;
          lastMessageId = getLastMessageId(messages100);

          for (const msg of messages100) yield msg;

          left -= messages100.length;
        } catch (err: any) {
          if (err?.message === errorIdMessage) break;

          console.log(
            `Error from generator. Count: ${count}, left: ${left}, prevID: ${prevId}, lastMsgId: ${lastMessageId}`
          );
        }
      }
    };

    const asPromise = async () => {
      let messages: Message[] = [];
      let left = limit;
      let lastMessageId = id;
      let prevId = '';

      while (lastMessageId && lastMessageId !== prevId && left > 0) {
        const count = left <= 100 ? left : 100;
        try {
          const messages100 = await self.#simpleBefore(lastMessageId, count);
          prevId = lastMessageId;
          lastMessageId = getLastMessageId(messages100);
          messages.push(...messages100);

          left -= messages100.length;
        } catch (err: any) {
          if (err?.message === errorIdMessage) break;
          console.log(
            `Error from promise.  Count: ${count}, left: ${left}, prevID: ${prevId}, lastMsgId: ${lastMessageId}`
          );
        }
      }

      return messages;
    };

    return {
      asGenerator,
      asPromise,
    };
  }

  last(limit: number) {
    return this.before(this.lastMessageId!, limit);
  }

  first(limit: number) {
    return this.after('0', limit);
  }

  around(id: Snowflake, limit: number) {
    return this.#simpleAround(id, limit);
  }

  #simpleFetch({ type }: Options) {
    return (id: Snowflake, limit: number) => {
      if (limit > 100) throw new Error(`#simple${capitalize(type)} argument error: should be limit<=100`);
      if (limit <= 0) throw new Error(`#simple${capitalize(type)} argument error: should be limit>0`);
      return this.channel.messages.fetch({ [`${type}`]: id, limit }).then(messages => Array.from(messages.values()));
    };
  }

  #simpleBefore(id: Snowflake, limit: number) {
    return this.#simpleFetch({ type: 'before' })(id, limit);
  }
  #simpleAfter(id: Snowflake, limit: number) {
    return this.#simpleFetch({ type: 'after' })(id, limit);
  }
  #simpleAround(id: Snowflake, limit: number) {
    return this.#simpleFetch({ type: 'around' })(id, limit);
  }

  get lastMessageId() {
    return this.channel.lastMessageId;
  }
}
