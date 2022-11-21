import { Collection } from 'discord.js';
import { Command } from '../../types.js';

export const putCommandsIntoCollection = async (commands: Command[], collection: Collection<string, any>) => {
  commands.forEach(command => collection.set(command.data.name, command));
};
