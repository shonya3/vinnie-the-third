import { Message } from 'discord.js';

export const onMessage = async (msg: Message) => {
	try {
		// console.log(msg.content.charCodeAt(0).toString(16), msg.content.charCodeAt(1).toString(16));
		// console.log(msg.content.charCodeAt(0), msg.content.charCodeAt(1));
		if (msg.content.includes('nivazmojna')) await msg.react('<:nivazmojna:850123166923882558>');
		if (msg.content.includes('jaba')) await msg.react('<:jaba:637684829114204175>');

		const utrechka = ['утреч', 'yтреч', 'утpеч', 'утрeч', 'yтpеч', 'yтрeч', 'утpeч', 'yтpeч'].some(variant =>
			msg.content.toLowerCase().includes(variant)
		);
		if (utrechka) await msg.react('🤓');
	} catch (err) {
		console.log('Emoji reaction error');
		console.log(err);
	}
};
