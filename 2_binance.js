const ccxt = require("ccxt");
const pg = require("./database");
const upsert = require("./upsert");
const getBtc = require("./getCoinFactory");

const exchangeId = "binance",
  exchangeClass = ccxt[exchangeId],
  exchange = new exchangeClass({
    apiKey: "jshXgEK1klUiDZk8WKeMq2sv92SGKMRUqA6FRH1E42Qy9QjsvbGTvwE3i0otSoOj",
    secret: "4JBc8umq8MNBxRfN7DYRUL4vpUZieKCI7HdvvVmU2Wo9wZGa5qGEpyic4n4tL4kw",
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
  const prd = Object.keys(prdA);

  const coins = await pg("crypto")
    .select("*")
    .orderBy("cmc_rank")
     
    .offset(1);
  for (let i = 0; i < coins.length; i++) {
    const trade = `${coins[i].symbol}/BTC`;

    if (prd.find(c => c === trade)) {
      await getBtc(
        exchange,
        {
          name: coins[i].slug.concat(`_${exchangeId}`),
          symbol: coins[i].symbol
        },
        trade
      );
    } else {
       
    }
  }
})();
