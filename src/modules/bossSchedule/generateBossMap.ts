import { cronToClosestDate } from '../../lib/dates.js';
import { table } from './table.js';

export const generateBossMap = (
	{ nameStyle }: { nameStyle: 'full' | 'short' } = { nameStyle: 'short' }
): Map<number, string[]> => {
	const map: Map<EpochTimeStamp, string[]> = new Map();

	for (const boss of table) {
		const name = nameStyle === 'short' ? boss.shortName : boss.name;
		for (const cron of boss.cronExpressions) {
			const timestamp = cronToClosestDate(cron).getTime();
			const bossNames = map.get(timestamp) ?? [];
			bossNames.push(name);
			map.set(timestamp, bossNames);
		}
	}

	return new Map(Array.from(map).sort((a, b) => a[0] - b[0]));
};
