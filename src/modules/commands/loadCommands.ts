import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readdirSync } from 'node:fs';

import { resolveFrom__dirname, extnameJsTs } from '../../lib/general.js';

import type { Command } from '../../types.js';

export const loadCommands = async (importMetaUrl: string, commandsPath: string) => {
  const pathCommandsDir = resolveFrom__dirname(importMetaUrl, commandsPath);
  const commandFilenames = readdirSync(pathCommandsDir).filter(extnameJsTs);

  const commands: Command[] = [];

  const commandPromises = commandFilenames.map(async filenameExtname => {
    const filePath = resolve(pathCommandsDir, filenameExtname);
    const fileURL = pathToFileURL(filePath).href;
    const { command } = await import(fileURL);
    commands.push(command);
  });

  await Promise.all(commandPromises).catch(console.log);
  return commands;
};
