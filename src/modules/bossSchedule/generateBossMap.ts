import { cronToClosestDate } from '../../lib/dates.js';

import type { BossWithCron, BossWithDate } from '../../types.js';
import { table } from './table.js';

export const generateBossMap = (
	{ nameStyle }: { nameStyle: 'full' | 'short' } = { nameStyle: 'short' }
): Map<number, string[]> => {
	const bossWithDateArray: BossWithDate[] = [];

	for (const boss of table) {
		for (const cron of boss.cronExpressions) {
			bossWithDateArray.push({
				name: boss.name,
				shortName: boss.shortName,
				respawnDate: cronToClosestDate(cron),
			});
		}
	}

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
