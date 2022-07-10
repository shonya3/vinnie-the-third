import { cronToClosestDate } from '../../../utils/dates.js';
import bossCronTable from '../../../bossCronTable.json' assert { type: 'json' };

import type { BossWithCron, BossWithDate } from '../../../types.js';

export const generateBossMap = (
  { nameStyle }: { nameStyle: 'full' | 'short' } = { nameStyle: 'short' }
): Map<number, string[]> => {
  const bossWithDateArray: BossWithDate[] = [];

  (bossCronTable as BossWithCron[]).forEach(boss =>
    boss.cronExpressions.forEach(cronExp => {
      const date = cronToClosestDate(cronExp);
      const bossWithDate: BossWithDate = {
        name: boss.name,
        shortName: boss.shortName,
        respawnDate: date,
      };
      bossWithDateArray.push(bossWithDate);
    })
  );

  bossWithDateArray.sort((a, b) => a.respawnDate.getTime() - b.respawnDate.getTime());

  const map: Map<EpochTimeStamp, string[]> = new Map();

  bossWithDateArray.forEach(boss => {
    const timestamp = boss.respawnDate.getTime();
    const bossNames = map.get(timestamp) ?? [];

    const name = nameStyle === 'short' ? boss.shortName : boss.name;
    bossNames.push(name);
    map.set(timestamp, bossNames);
  });

  return map;
};
