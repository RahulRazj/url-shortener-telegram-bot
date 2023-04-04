import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { makePostReq } from './externalRequestUtil.js';
import express from 'express'
import { webhookCallback, Bot } from 'grammy';
import grammy from 'grammy';
dotenv.config();

// const bot = new Telegraf(process.env.BOT_TOKEN);
const bot = new Bot(process.env.BOT_TOKEN);

// Start the server
if (process.env.NODE_ENV === 'production') {
	// Use Webhooks for the production server
	const app = express();
	app.use(express.json());
	app.use(webhookCallback(bot, 'express'));

	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		console.log(`Bot listening on port ${PORT}`);
	});
}


bot.start(ctx => ctx.reply('Welcome to the URL Shortener Bot. Use /url to send url to shorten. Send command like "/url https://www.reddit.com/r/AskReddit"'));

bot.command('url', async ctx => {
	try {
		const url = ctx.message.text.split(' ').at(1);

		if (!url) {
			ctx.reply('Please send an url separated by space after /url command');
			return;
		}

		const params = {
			connUrl: process.env.URL_API,
			body: {
				url
			}
		};
        
        let data = await makePostReq(params);
        data = JSON.parse(data);

        ctx.reply(`${process.env.URL_API}/${data.token}`);
	} catch (error) {
		ctx.reply(error.message);
	}
});

bot.on('message', async ctx => {
	// Using context shortcut
	await ctx.reply('Please use /url command to send URLs');
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
