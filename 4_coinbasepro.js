const CoinbasePro = require("coinbase-pro");
const publicClient = new CoinbasePro.PublicClient();

const ccxt = require("ccxt");
// const axios = require("axios");
const pg = require("./database");
const upsert = require("./upsert");

const random = (from, range) => Math.floor(Math.random() * range + from);

const delay = time => {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
};

const getBtc = async (coin, symbol) => {
  console.log(coin.name);
  for (let i = 0; i < 100000; i++) {
    const lastTime = await pg(coin.name).min("time");

    const since = lastTime[0].min
      ? new Date(lastTime[0].min).getTime() - 60000
      : new Date().getTime();
    const res = await publicClient.getProductHistoricRates(
      symbol.replace("/", "-"),
      {
        granularity: 60,
        start: new Date(since - 60000 * 300),
        end: new Date(since)
      }
    );

    const trades = res.map(r => [
      (r[0] = r[0] * 1000),
      r[1],
      r[2],
      r[3],
      r[4],
      r[5]
    ]);

    // console.log(trades);
    await upsert(coin, trades);
    await delay(random(0, 1000));
    if (lastTime[0].max && !trades.length) {
      break;
    }
  }
};

const exchangeId = "coinbasepro",
  exchangeClass = ccxt[exchangeId],
  exchange = new exchangeClass({
    // apiKey: "jshXgEK1klUiDZk8WKeMq2sv92SGKMRUqA6FRH1E42Qy9QjsvbGTvwE3i0otSoOj",
    // secret: "4JBc8umq8MNBxRfN7DYRUL4vpUZieKCI7HdvvVmU2Wo9wZGa5qGEpyic4n4tL4kw",
    timeout: 30000,
    enableRateLimit: true
  });

(async () => {
  await getBtc(
    { name: "bitcoin".concat(`_${exchangeId}`), symbol: "BTC" },
    "BTC/USD"
  );
  const prdA = await exchange.loadMarkets();
  const prd = Object.entries(prdA).map(c => ({
    key: c[0],
    name: `${c[1].base}/${c[1].quote}`
  }));

  const coins = await pg("crypto")
    .select("*")
    .orderBy("cmc_rank")
     
    .offset(1);
  for (let i = 0; i < coins.length; i++) {
    const trade = `${coins[i].symbol}/BTC`;
    const s = prd.find(c => c.name === trade);
    if (s) {
      await getBtc(
        {
          name: coins[i].slug.concat(`_${exchangeId}`),
          symbol: trade
        },
        s.key
      );
    } else {
      console.log(`CANTTTTT NOT FIND ${coins[i].slug}`);
    }
  }
})();
