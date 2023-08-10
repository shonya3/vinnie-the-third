import { cat } from './cat.js';
import { next } from './next.js';
import { ping } from './ping.js';
import { subscribe } from './subscribe.js';
import { subscriptions } from './subscriptions.js';
import { unsubscribe } from './unsubscribe.js';
import { Command } from '../../types.js';
import { timeLeft } from '../../lib/dates.js';
import { bold } from 'discord.js';
import { today } from './today.js';

export const bossesString = (map: Map<number | string, string[]>, num?: number) =>
	Array.from(map.entries())
		.slice(0, num)
		.map(([timestamp, bosses]) => {
			const date = new Date(timestamp);
			const spawnTimeString = date.toLocaleTimeString('ru', { timeStyle: 'short' });
			const timeLeftMessage = timeLeft(date);
			const bossesNamesString = bold(bosses.join(', '));
			return `${spawnTimeString} - ${bossesNamesString}. ${timeLeftMessage}`;
		})
		.join('\n');

export const commands = {
	cat,
	next,
	ping,
	subscribe,
	subscriptions,
	unsubscribe,
	today,
} satisfies Record<string, Command>;
