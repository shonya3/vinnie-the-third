import { Client, GuildMember, TextChannel } from 'discord.js';
import { EventEmitter } from 'node:events';
import { timeString } from './dates.js';
import { AnyFunction } from '../types.js';

export type UserGetter = (...args: any[]) => Promise<GuildMember> | Promise<GuildMember | null | undefined>;
export type GuildMemberId = {
	guildId: string;
	memberId: string;
};
export type StatusCallbacks = {
	onStatusOnline?: AnyFunction;
	onStatusOffline?: AnyFunction;
};

const online = (member: GuildMember): boolean => {
	return Boolean(member.presence && (member.presence.status === 'idle' || member.presence.status === 'online'));
};

export const fetchUser = async (client: Client, guildId: string, memberId: string): Promise<GuildMember> => {
	return client.guilds.cache
		.get(guildId)!
		.members.fetch()
		.then(members => members.get(memberId)!);
};

const initGetter = (client: Client, userGetter: UserGetter | GuildMemberId): (() => Promise<GuildMember>) => {
	if (typeof userGetter === 'function') {
		return async () => {
			const user = await userGetter();
			if (!user) {
				throw new Error('No user');
			}
			return user;
		};
	} else {
		return async () => {
			const user = await fetchUser(client, userGetter.guildId, userGetter.memberId);
			if (!user) {
				throw new Error('No user');
			}

			return user;
		};
	}
};

export const watchStatus = (
	client: Client,
	userGetter: UserGetter | GuildMemberId,
	statusCallbacks?: StatusCallbacks
): StatusWatcher => {
	return new StatusWatcher(client, userGetter, statusCallbacks).watch();
};

const log = <K extends keyof typeof Status>(status: (typeof Status)[K], logName: string) => {
	console.log(`${timeString()} Status watcher update :::: ${logName} new status: ${status}`);
};

const CHECK_INTERVAL = 30 * 1000;
const MARK_OFFLINE_TIMEOUT = 10 * 60 * 1000;

export const Status = {
	Online: 'online',
	Offline: 'offline',
} as const;

export class StatusWatcher extends EventEmitter {
	fetchUser: () => Promise<GuildMember>;
	statusCallbacks?: StatusCallbacks;
	#logName = '';
	constructor(client: Client, userGetter: UserGetter | GuildMemberId, statusCallbacks?: StatusCallbacks) {
		super();
		this.statusCallbacks = statusCallbacks;
		this.fetchUser = initGetter(client, userGetter);
	}

	watch() {
		this.on(Status.Offline, async () => {
			this.#log(Status.Offline);
			this.statusCallbacks?.onStatusOffline?.();
			this.#whileOffline();
		});

		this.on(Status.Online, async () => {
			this.#log(Status.Online);
			this.statusCallbacks?.onStatusOnline?.();
			this.#whileOnline();
		});

		this.fetchUser().then(user => {
			online(user) ? this.#whileOnline() : this.#whileOffline();
		});

		return this;
	}

	log(val: string) {
		this.#logName = val;
		return this;
	}

	#log<K extends keyof typeof Status>(status: (typeof Status)[K]) {
		if (this.#logName) log(status, this.#logName);
	}

	#whileOnline() {
		const interval = setInterval(async () => {
			try {
				const user = await this.fetchUser();
				if (!online(user)) {
					clearInterval(interval);

					setTimeout(async () => {
						try {
							const user = await this.fetchUser();
							online(user) ? this.#whileOnline() : this.emit(Status.Offline);
						} catch (err) {
							console.log(err);
						}
					}, MARK_OFFLINE_TIMEOUT);
				}
			} catch (err) {
				console.log(err);
			}
		}, CHECK_INTERVAL);
	}

	#whileOffline() {
		const interval = setInterval(async () => {
			try {
				const user = await this.fetchUser();
				if (online(user)) {
					clearInterval(interval);
					this.emit(Status.Online);
				}
			} catch (err) {
				console.log(err);
			}
		}, CHECK_INTERVAL);
	}
}
