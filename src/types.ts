import type { Announcement } from './lib/Announcement.js';
import type { SlashCommandBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction, Client, ClientPresence } from 'discord.js';
import type { Collection } from '@discordjs/collection';
import type { RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit } from 'node-schedule';

declare module 'discord.js' {
	interface Client {
		announcements: Collection<string, ScheduledAnnouncement[]>;
	}
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends IProcessEnv {}
	}
}

export interface IProcessEnv {
	TOKEN: string;
	NODE_ENV: 'production' | 'development';
	APPID: string;
	GUILDS: string;
	POSTGRES_PORT: string;
	POSTGRES_HOST: string;
	POSTGRES_USER: string;
	POSTGRES_PASSWORD: string;
	POSTGRES_DB: string;
}

export interface Command {
	data: SlashCommandBuilder;
	execute: (interaction: ChatInputCommandInteraction, ...args: any[]) => any;
}

declare module 'node-schedule' {
	interface Job {
		announcement?: Announcement;
	}
}

export interface Time {
	sec?: number;
	min?: number;
	hour?: number;
	day?: number;
}

type CronSign = '*' | `${number}`;
export type CronExpression = `${CronSign} ${CronSign} ${CronSign} ${CronSign} ${CronSign}`;
// export type CronExpression = string;
export type BossName =
	| 'Продажный правитель Кзарка'
	| 'Древний Кутум'
	| 'Офин-разрушитель'
	| 'Квинт'
	| 'Велл'
	| 'Мурака'
	| 'Нубэр'
	| 'Каранда'
	| 'Камос';

export type BossShortName = 'Кзарка' | 'Кутум' | 'Офин' | 'Квинт' | 'Велл' | 'Мурака' | 'Нубэр' | 'Каранда' | 'Камос';
export interface BossWithCron {
	name: BossName;
	shortName: BossShortName;
	cronExpressions: CronExpression[];
}
export interface BossWithDate {
	name: BossName;
	shortName: BossShortName;
	respawnDate: Date;
	cronExpression?: CronExpression;
	timestamp?: EpochTimeStamp;
}

export type Rule = RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string | number;

export interface BossSubscriptionForChannel {
	channelId: string;
	offsets: Array<number>;
}

export type TimeUnit = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days';
export type AnyFunction = (...args: any[]) => any;
export type Wrapper<T extends AnyFunction> = (f: T) => (...args: Parameters<T>) => ReturnType<T>;
export type PresenceSetter = (client: Client) => ClientPresence;
export type RepeatingCallback = (offset: number, timeout: number, unit: TimeUnit) => Promise<any>;
export type ReleaseCallback = AnyFunction;
export interface OffsetsWithTimeUnit {
	offsets: Offset[];
	unit: TimeUnit;
}
export type Offset = number;
export type ScheduledAnnouncement = Announcement & { cancel: () => void };
