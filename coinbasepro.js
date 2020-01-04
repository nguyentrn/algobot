const ccxt = require("ccxt");
const pg = require("./database");
const upsert = require("./upsert");

(async function() {
  const exchangeId = "coinbasepro",
    exchangeClass = ccxt[exchangeId],
    exchange = new exchangeClass({
      apiKey:
        "jshXgEK1klUiDZk8WKeMq2sv92SGKMRUqA6FRH1E42Qy9QjsvbGTvwE3i0otSoOj",
      secret:
        "4JBc8umq8MNBxRfN7DYRUL4vpUZieKCI7HdvvVmU2Wo9wZGa5qGEpyic4n4tL4kw",
      timeout: 30000,
      enableRateLimit: true
    });
  console.log(exchange.has);

  coin = { name: "bitcoin".concat(`_${exchangeId}`), symbol: "BTC" };
  if (exchange.has["fetchOHLCV"]) {
    for (let i = 0; i < 10000; i++) {
      const lastTime = await pg(coin.name).max("time");
      console.log(lastTime[0].max);
      const since = lastTime[0].max
        ? new Date(lastTime[0].max).getTime() + 60000
        : 1410000000000;
      console.log(since);
      const symbol = "BTC/USD";
      const timeframe = "300";
      const limit = 1000;
      const trades = await exchange.fetchOHLCV(symbol, timeframe, since, limit);

      await upsert(coin, trades);

      if (lastTime[0].max && !trades.length) {
        break;
      }
    }
  }
})();
