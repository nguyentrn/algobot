//
//
//
//
//
//
const axios = require("axios");
const pg = require("./database");
const insert = require("./insertCoinInfo");
const delay = time => {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
};

const scraper = async model => {
  try {
    for (let i = 0; i < 50; i++) {
      const lastTimeDate = await pg(model.name)
        // .select("*")
        .min("time")
        .limit(1);
      const lastTimestamp = new Date(lastTimeDate[0].min).getTime();
      const link = `https://www.binance.com/api/v1/klines?symbol=${
        model.symbol
      }USDT&interval=1m${
        lastTimestamp ? `&endTime=${lastTimestamp - 60000}` : ""
      }&limit=1000`;
      console.log(i, model.symbol);
      const coins = await axios(link);
      if (coins.data.length < 1000) {
        break;
      }
      if (coins.data.length) {
        // coins.data.forEach(async dt => {
        // const scrapedA = await pg(model.name)
        //   .where({ time: new Date(dt[0]) })
        //   .select("*");
        // const scraped = scrapedA[0];
        // console.log(scraped);
        // if (!scraped) {
        await insert(model, coins.data);
        // }
        // });
      }
      if (coins.data.length < 1000) {
        break;
      }

      await delay(10000);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = scraper;
