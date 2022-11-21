import db from '../../models/bossSubscriptions/db.js';
import { BossSubscriptionForChannel } from '../../types.js';

const saveSubscription = async (channelId: string, offsets: Array<number>) => {
  const queryResult = await db
    .query(
      `INSERT INTO bosssubscriptions (channel_id, offsets) 
        values ($1, $2)
        RETURNING *`,
      [channelId, offsets]
    )
    .then(queryResult => queryResult.rows[0]);
  const newSubscription: BossSubscriptionForChannel = {
    channelId: queryResult.channel_id,
    offsets: queryResult.offsets,
  };
  return newSubscription;
};
const getOneChannel = async (channelId: string) => {
  const queryResult = await db.query('SELECT * FROM bosssubscriptions WHERE channel_id = $1', [channelId]);
  const subscription: BossSubscriptionForChannel | undefined = queryResult.rows[0];
  return subscription;
};
const getChannels = async () => {
  const queryResult = await db.query('SELECT * FROM bosssubscriptions').then(qr => qr.rows);
  const subscriptions: BossSubscriptionForChannel[] = queryResult.map(el => ({
    channelId: el.channel_id,
    offsets: el.offsets,
  }));
  return subscriptions;
};
const deleteChannel = async (channelId: string) => {
  const queryResult = await db
    .query('DELETE FROM bosssubscriptions WHERE channel_id = $1 RETURNING *', [channelId])
    .then(qr => qr.rows[0]);
  const subscription: BossSubscriptionForChannel = { channelId: queryResult.channel_id, offsets: queryResult.offsets };
  return subscription;
};

export default {
  saveSubscription,
  getOneChannel,
  getChannels,
  deleteChannel,
};
