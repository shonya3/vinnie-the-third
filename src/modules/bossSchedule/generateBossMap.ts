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

const isNightHour = (hour: number) => hour === 0 || hour === 1 || hour === 2;
export const generateTodayBossMap = ({ nameStyle }: { nameStyle: 'full' | 'short' }) => {
	let prevSpawnHour: null | number = null;
	const outputMap = new Map();

	for (const [timestamp, bosses] of generateBossMap({ nameStyle })) {
		const hour = new Date(timestamp).getHours();

		if (prevSpawnHour !== null && isNightHour(prevSpawnHour)) {
			if (hour - prevSpawnHour > 6) {
				console.log(bosses);
				break;
			}
		}
		prevSpawnHour = hour;
		outputMap.set(timestamp, Array.from(bosses));
	}

	return outputMap;
};
