import { Client, GuildMember, TextChannel } from 'discord.js';
import { EventEmitter } from 'node:events';
import { timeString } from '../lib/dates.js';

const statusWatcher = new EventEmitter() as EventEmitter & {
	client: Client;
	init(client: Client, channel: TextChannel): Promise<void>;
};

statusWatcher.init = async (client, channel) => {
	statusWatcher.client = client;
	statusWatcher.on('new status: offline', async () => {
		console.log(`${timeString()} Status watcher update :::: new status: offline`);
		await channel.send(':rabbit: ушел');
		whileOffline();
	});

	statusWatcher.on('new status: online', async () => {
		console.log(`${timeString()} Status watcher update :::: new status: online`);
		await channel.send(':rabbit: пришел');
		whileOnline();
	});

	const kroiya = await getKroiya();
	online(kroiya) ? whileOnline() : whileOffline();
};

const online = (member: GuildMember): boolean => {
	return Boolean(member.presence && (member.presence.status === 'idle' || member.presence.status === 'online'));
};

const fetchUser = async (client: Client, guildId: string, memberId: string): Promise<GuildMember> => {
	return client.guilds.cache
		.get(guildId)!
		.members.fetch()
		.then(members => members.get(memberId)!);
};

const getKroiya = async (): Promise<GuildMember> => {
	return fetchUser(statusWatcher.client, `356012941083934721`, `182893458858442762`);
};

const whileOffline = () => {
	const interval = setInterval(async () => {
		try {
			const kroiya = await getKroiya();
			if (online(kroiya)) {
				clearInterval(interval);
				statusWatcher.emit('new status: online');
			}
		} catch (err) {
			console.log(err);
		}
	}, 30 * 1000);
};

const whileOnline = () => {
	const interval = setInterval(async () => {
		try {
			const kroiya = await getKroiya();
			if (!online(kroiya)) {
				clearInterval(interval);

				setTimeout(async () => {
					try {
						const kroiya = await getKroiya();
						online(kroiya) ? whileOnline() : statusWatcher.emit('new status: offline');
					} catch (err) {
						console.log(err);
					}
				}, 10 * 60 * 1000);
			}
		} catch (err) {
			console.log(err);
		}
	}, 30 * 1000);
};

export default statusWatcher;
