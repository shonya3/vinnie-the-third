import { Job } from 'node-schedule';
import { Collection } from 'discord.js';

export const putJobIntoCollection = (job: Job, channelId: string, collection: Collection<string, Job[]>) => {
  const arr = collection.get(channelId);
  arr ? arr.push(job) : collection.set(channelId, [job]);
};
