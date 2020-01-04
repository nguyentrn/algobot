const ccxt = require("ccxt");
const pg = require("./database");
const upsert = require("./upsert");

const getBtc = async (coin, symbol) => {
  if (exchange.has["fetchOHLCV"]) {
    for (let i = 0; i < 10000; i++) {
      const lastTime = await pg(coin.name).max("time");
      console.log(lastTime[0].max);
      const since = lastTime[0].max
        ? new Date(lastTime[0].max).getTime() + 60000
        : 1000000000000;
      console.log(since);
      // const symbol = "BTC/USDT";
      const timeframe = "1m";
      const limit = 1000;
      const trades = await exchange.fetchOHLCV(symbol, timeframe, since, limit);

      await upsert(coin, trades);

      if (lastTime[0].max && !trades.length) {
        break;
      }
    }
  }
};

(async () => {
  const exchangeId = "bittrex",
    exchangeClass = ccxt[exchangeId],
    exchange = new exchangeClass({
      apiKey:
        "jshXgEK1klUiDZk8WKeMq2sv92SGKMRUqA6FRH1E42Qy9QjsvbGTvwE3i0otSoOj",
      secret:
        "4JBc8umq8MNBxRfN7DYRUL4vpUZieKCI7HdvvVmU2Wo9wZGa5qGEpyic4n4tL4kw",
      timeout: 30000,
      enableRateLimit: true
    });
  // await getBtc(
  //   { name: "bitcoin".concat(`_${exchangeId}`), symbol: "BTC" },
  //   "BTC/USDT"
  // );
  const coins = await pg("crypto")
    .select("*")
    .orderBy("cmc_rank")
    .limit(10)
    .offset(1);
  for (let i = 0; i < coins.length; i++) {
    await getBtc(
      { name: coins[i].slug.concat(`_${exchangeId}`), symbol: coins[i].symbol },
      `${coins[i].symbol}/BTC`
    );
  }
})();
