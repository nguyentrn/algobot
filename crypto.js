const ccxt = require("ccxt");
const pg = require("./database");
const upsert = require("./upsert");

(async function() {
  const exchangeId = "coinmarketcap",
    exchangeClass = ccxt[exchangeId],
    exchange = new exchangeClass({
      apiKey:
        "jshXgEK1klUiDZk8WKeMq2sv92SGKMRUqA6FRH1E42Qy9QjsvbGTvwE3i0otSoOj",
      secret:
        "4JBc8umq8MNBxRfN7DYRUL4vpUZieKCI7HdvvVmU2Wo9wZGa5qGEpyic4n4tL4kw",
      timeout: 30000,
      enableRateLimit: true
    });
  let currencies = exchange.currencies;
  const limit = 1000;
  const data = await exchange.fetchCurrencies(limit);
  const res = Object.values(data);

  const done = Object.values(data).map(c => ({
    symbol: c.info.symbol,
    name: c.info.name,
    slug: c.info.id.replace("-", "_"),
    price: c.info.price_usd,
    market_cap: c.info.market_cap_usd,
    available_supply: c.info.available_supply,
    max_supply: c.info.max_supply,
    total_supply: c.info.total_supply,
    cmc_rank: c.info.rank,
    last_updated: new Date(c.info.last_updated * 1000)
  }));
  await pg.batchInsert("crypto", done);
})();
