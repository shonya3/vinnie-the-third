import { AUTODELETE_TIMER } from '../../../const.js';
import { autodeleteReply } from './autodeleteReply.js';

import { Client, Interaction, InteractionType, Message } from 'discord.js';

export const interactionHandler = async (interaction: Interaction, client: Client) => {
  if (interaction.type !== InteractionType.ApplicationCommand) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
    const cancelAutodeletion = autodeleteReply(interaction, AUTODELETE_TIMER);
    const reply = (await interaction.fetchReply()) as Message;
    const reactionCollector = reply.createReactionCollector({ time: AUTODELETE_TIMER * 1000 });
    reactionCollector.once('collect', () => {
      cancelAutodeletion();
      reactionCollector.stop();
    });
  } catch (err) {
    console.log('Interaction command error');
    console.log(err);
  }
};
