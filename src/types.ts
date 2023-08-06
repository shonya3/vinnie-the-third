import type { Announcement } from './lib/Announcement.js';
import type { SlashCommandBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction, Client, ClientPresence } from 'discord.js';
import type { Collection } from '@discordjs/collection';
import type { RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit } from 'node-schedule';

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

export interface BossWithCron {
	name: string;
	shortName: string;
	cronExpressions: CronExpression[];
}
export interface BossWithDate {
	name: string;
	shortName: string;
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
