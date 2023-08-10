import { bossesString } from './bot/commands/mod.js';
import { client as bot } from './bot/index.js';
import { configENV } from './configENV.js';
import { generateTodayBossMap } from './modules/bossSchedule/generateBossMap.js';
configENV();
bot.login(process.env.TOKEN);
