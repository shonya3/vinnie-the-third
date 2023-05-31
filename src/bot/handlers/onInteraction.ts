import { ChatInputCommandInteraction, Client, CommandInteraction, InteractionType, Message } from 'discord.js';
import { AUTODELETE_TIMER } from '../../const.js';
import { commands } from '../commands/mod.js';

const autodeleteReply = (interaction: CommandInteraction, timeout: number) => {
	const timerId = setTimeout(() => {
		interaction.deleteReply();
	}, timeout * 1000);

	const cancelDelete = () => clearTimeout(timerId);
	return cancelDelete;
};

export const onInteraction = async (interaction: ChatInputCommandInteraction, client: Client) => {
	if (interaction.type !== InteractionType.ApplicationCommand) return;

	const name = interaction.commandName as keyof typeof commands;
	if (!Object.hasOwn(commands, name)) return;
	const command = commands[name];

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
