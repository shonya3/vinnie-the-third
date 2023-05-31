import { client as bot } from './bot/index.js';
import { configENV } from './configENV.js';

configENV();
bot.login(process.env.TOKEN);
