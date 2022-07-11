import bossCronTable from '../../models/bossSchedule/bossCronTable.json' assert { type: 'json' };
import { Announcement } from '../../lib/Announcement.js';
import type { BossWithCron, CronExpression } from '../../types.js';
import { DEFAULT_OFFSETS } from '../../const.js';

export const announcementsFromTable = (offsets = DEFAULT_OFFSETS) => {
  const announcementArray: Announcement[] = [];
  (bossCronTable as BossWithCron[]).forEach((boss: BossWithCron) => {
    boss.cronExpressions.forEach((cronExpression: CronExpression) => {
      const announcement = new Announcement(cronExpression, offsets);
      announcement.addContext('bossName', boss.name);
      announcementArray.push(announcement);
    });
  });

  return announcementArray;
};