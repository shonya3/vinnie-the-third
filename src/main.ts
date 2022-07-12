import { readFile } from 'fs';
import bot from './bot/index.js';
import { configENV } from './configENV.js';

configENV();
await bot.login(process.env.TOKEN);
