import { Client } from 'discord.js';
import { scheduleJob } from 'node-schedule';
import { generateBossMap } from '../../models/bossSchedule/generateBossMap.js';
import { setNextBossPresence } from './setNextBossPresence.js';
import { getPresence, setPresence } from '../../lib/discord.js';
const watchPresence = (client: Client) => setInterval(() => setPresence(client, getPresence(client)), 3000 * 60);

export const schedulePresenceUpdate = (client: Client) => {
  const bossTimestamps = Array.from(generateBossMap().keys());
  setNextBossPresence(client);
  watchPresence(client);

  bossTimestamps.forEach(ts =>
    scheduleJob(new Date(ts), () => {
      setNextBossPresence(client);
    })
  );
};
