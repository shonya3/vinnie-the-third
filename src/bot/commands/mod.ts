import { cat } from './cat.js';
import { next } from './next.js';
import { ping } from './ping.js';
import { subscribe } from './subscribe.js';
import { subscriptions } from './subscriptions.js';
import { unsubscribe } from './unsubscribe.js';
import { Command } from '../../types.js';

export const commands = {
	cat,
	next,
	ping,
	subscribe,
	subscriptions,
	unsubscribe,
} satisfies Record<string, Command>;
