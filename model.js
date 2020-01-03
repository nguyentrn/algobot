//
//
//
//
//
//
const axios = require("axios");
const pg = require("./database");
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
        lastTimestamp ? `&endTime=${lastTimestamp}` : ""
      }&limit=1000`;
      console.log(i, link);
      const coins = await axios(link);
      if (coins.data.length < 1000) {
        break;
      }
      if (coins.data.length) {
        coins.data.forEach(async dt => {
          const scrapedA = await pg(model.name)
            .where({ time: new Date(dt[0]) })
            .select("*");
          const scraped = scrapedA[0];
          // console.log(scraped);
          if (!scraped) {
            await pg(model.name).insert({
              time: new Date(dt[0]),
              open: dt[1],
              high: dt[2],
              low: dt[3],
              close: dt[4],
              volume: dt[5],
              close_time: new Date(dt[6]),
              quote: dt[7],
              number_of_trades: dt[8],
              taker_buy_base: dt[9],
              taker_buy_quote: dt[10],
              ignore: dt[11]
            });
          }
        });
      }
      await delay(10000);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = scraper;
