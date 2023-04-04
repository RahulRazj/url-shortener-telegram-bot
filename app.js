import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { makePostReq } from './externalRequestUtil.js';
import express from 'express'
dotenv.config();

const app = express();
app.get('/', (req, res) => {
	res.send('Okay, working');
});

const port = 3035;
app.listen(port, () => console.log('Server running at port', port));

const bot = new Telegraf(process.env.BOT_TOKEN);
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

bot.on('text', async ctx => {
	// Using context shortcut
	await ctx.reply('Please use /url command to send URLs');
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
