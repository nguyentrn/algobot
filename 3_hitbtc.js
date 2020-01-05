const ccxt = require("ccxt");
const pg = require("./database");
const upsert = require("./upsert");
const getBtc = require("./getCoinFactory");

const exchangeId = "hitbtc",
  exchangeClass = ccxt[exchangeId],
  exchange = new exchangeClass({
    // apiKey: "jshXgEK1klUiDZk8WKeMq2sv92SGKMRUqA6FRH1E42Qy9QjsvbGTvwE3i0otSoOj",
    // secret: "4JBc8umq8MNBxRfN7DYRUL4vpUZieKCI7HdvvVmU2Wo9wZGa5qGEpyic4n4tL4kw",
    timeout: 30000,
    enableRateLimit: true
  });

(async () => {
  await getBtc(
    exchange,
    { name: "bitcoin".concat(`_${exchangeId}`), symbol: "BTC" },
    "BTC/USDT"
  );
  const prdA = await exchange.loadMarkets();
  const prd = Object.entries(prdA).map(c => ({
    key: c[0],
    name: `${c[1].base}/${c[1].quote}`
  }));

  const coins = await pg("crypto")
    .select("*")
    .orderBy("cmc_rank")
    .limit(100)
    .offset(1);
  for (let i = 0; i < coins.length; i++) {
    const trade = `${coins[i].symbol}/BTC`;
    const s = prd.find(c => c.name === trade);
    if (s) {
      await getBtc(
        exchange,
        {
          name: coins[i].slug.concat(`_${exchangeId}`),
          symbol: trade
        },
        s.key
      );
    } else {
    }
  }
})();
