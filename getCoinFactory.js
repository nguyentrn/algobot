const ccxt = require("ccxt");
const pg = require("./database");
const upsert = require("./upsert");

const getBtc = async (exchange, coin, symbol) => {
  try {
    if (exchange.has["fetchOHLCV"]) {
      console.log(coin.name);
      for (let i = 0; i < 10000; i++) {
        const lastTime = await pg(coin.name).max("time");
        const since = lastTime[0].max
          ? new Date(lastTime[0].max).getTime() + 60000
          : 1000000000000;
        // console.log(since);
        // const symbol = "BTC/USDT";
        const timeframe = "1m";
        const limit = 1000;
        const trades = await exchange.fetchOHLCV(
          symbol,
          timeframe,
          since,
          limit
        );

        await upsert(coin, trades);

        if (lastTime[0].max && !trades.length) {
          break;
        }
      }
    }
  } catch (err) {
    console.log(err.name);
  }
};

module.exports = getBtc;
