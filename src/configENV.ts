import dotenv from 'dotenv';
import { throwIfNot } from './utils/general.js';

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

  const essentialEnvironmentVariables = [
    'TOKEN',
    'APPID',
    'GUILDS',
    'NODE_ENV',
    'POSTGRES_PORT',
    'POSTGRES_DB',
    'POSTGRES_PASSWORD',
    'POSTGRES_USER',
    'POSTGRES_HOST',
  ];
  dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
  essentialEnvironmentVariables.forEach(v => throwIfNot(process.env, v));
};
