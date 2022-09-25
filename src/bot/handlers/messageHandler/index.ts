import { Message } from 'discord.js';

export const messageHandler = async (msg: Message) => {
	try {
		if (msg.content.includes('nivazmojna')) await msg.react('<:nivazmojna:850123166923882558>');
		if (msg.content.includes('jaba')) await msg.react('<:jaba:637684829114204175>');
		if (msg.content.toLowerCase().includes('утреч')) await msg.react('🤓');
	} catch (err) {
		console.log('Emoji reaction error');
		console.log(err);
	}
};
