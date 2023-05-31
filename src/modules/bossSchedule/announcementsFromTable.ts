import { Announcement } from '../../lib/Announcement.js';
import { DEFAULT_OFFSETS } from '../../const.js';
import { table } from './table.js';

export const announcementsFromTable = (offsets = DEFAULT_OFFSETS) => {
	const announcementArray: Announcement[] = [];

	for (const boss of table) {
		for (const cron of boss.cronExpressions) {
			const announcement = new Announcement(cron, offsets);
			announcement.addContext('bossName', boss.name);
			announcementArray.push(announcement);
		}
	}

	return announcementArray;
};
