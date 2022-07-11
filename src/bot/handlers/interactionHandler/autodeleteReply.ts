import type { CommandInteraction } from 'discord.js';

export const autodeleteReply = (interaction: CommandInteraction, timeout: number) => {
  const timerId = setTimeout(() => {
    interaction.deleteReply();
  }, timeout * 1000);

  const cancelDelete = () => clearTimeout(timerId);
  return cancelDelete;
};
