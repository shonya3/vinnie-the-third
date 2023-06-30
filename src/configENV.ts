import dotenv from 'dotenv';
import { throwIfNot } from './lib/general.js';

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
	POSTGRES_DB: string;
}

const configNODE_ENV = () => {
	dotenv.config({ path: '.node.env' });
	if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'production')
		throw new Error('process.env.NODE_ENV type error');
};

const logOnlyOnce = () => {
	let said = false;
	return (phrase: string) => {
		if (said) return;
		console.log(phrase);
		said = true;
	};
};

const logNodeEnv = logOnlyOnce();

export const configENV = () => {
	configNODE_ENV();
	logNodeEnv(`NODE_ENV = ${process.env.NODE_ENV}`);
	switch (process.env.NODE_ENV) {
		case 'development':
			break;
		case 'production':
			break;
		default:
			throw new Error('process.env.NODE_ENV type error');
	}

	const essentialEnvironmentVariables = ['TOKEN', 'APPID', 'GUILDS', 'NODE_ENV', 'DATABASE_URL'];
	dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
	essentialEnvironmentVariables.forEach(v => throwIfNot(process.env, v));
};
