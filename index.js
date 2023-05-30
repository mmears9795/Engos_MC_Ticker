import fetch from 'node-fetch';
import { Client, Intents, Guild } from 'discord.js';
import dotenv from 'dotenv';

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

bot.on("ready", () => {
    console.log("The bot is ready");

    const priceCheckInterval = setInterval (async function () {

        let ENGOSprice = await getPrice();

        let totalSupply = 1000000000000000;

        let marketcap = (totalSupply / 20.8) * ENGOSprice;

        marketcap = marketcap.toFixed(2);

        marketcap = marketcap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        bot.user.setActivity("$" + marketcap, {type: 'WATCHING'});
    }, 30000);

});

async function getPrice() {
    try {
        const url = process.env.MOR_API;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'X-API-Key': process.env.MOR_API_KEY,
            }
        });
        const data = await response.json();
        let ethPrice = (data.nativePrice.value / (10**18)).toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 15 });
        let tempUSDPrice = (data.usdPrice);

        let usdPriceString = tempUSDPrice.toString();

        tempUSDPrice = usdPriceString.split('e-');

        let usdPrice = (tempUSDPrice[0] / (10**tempUSDPrice[1])).toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 11 });
        // console.log("ethPrice " + ethPrice);
        return(usdPrice);
    } catch(error) {
        console.log(error);
        getPrice();
    }
}

bot.login(process.env.DISCORD_BOT_TOKEN);