const ccxt = require("ccxt");
const axios = require("axios");
const pg = require("./database");
const upsert = require("./upsert");
// (async function() {
//   const exchangeId = "coinmarketcap",
//     exchangeClass = ccxt[exchangeId],
//     exchange = new exchangeClass({
//       apiKey:
//         "jshXgEK1klUiDZk8WKeMq2sv92SGKMRUqA6FRH1E42Qy9QjsvbGTvwE3i0otSoOj",
//       secret:
//         "4JBc8umq8MNBxRfN7DYRUL4vpUZieKCI7HdvvVmU2Wo9wZGa5qGEpyic4n4tL4kw",
//       timeout: 30000,
//       enableRateLimit: true
//     });
//   const limit = 1000;

//   exchange = new ccxt[exchangeId]({
//     timeout: 30000,
//     enableRateLimit: true
//   });

//   const data = await exchange.fetchCurrencies(limit);
//   const res = Object.values(data);
//   console.log(res.length);
//   const done = Object.values(data).map(c => ({
//     symbol: c.info.symbol,
//     name: c.info.name,
//     slug: c.info.id.replace("-", "_"),
//     price: c.info.price_usd,
//     market_cap: c.info.market_cap_usd,
//     available_supply: c.info.available_supply,
//     max_supply: c.info.max_supply,
//     total_supply: c.info.total_supply,
//     cmc_rank: c.info.rank,
//     last_updated: new Date(c.info.last_updated * 1000)
//   }));
//   await pg.batchInsert("crypto", done);
// })();

(async function() {
  const res = await axios(
    "https://web-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=USD&cryptocurrency_type=all&limit=3000&sort=market_cap&sort_dir=desc&start=1"
  );
  const data = res.data.data;
  console.log(data[0]);
  const done = Object.values(data).map(c => ({
    id: c.id,
    name: c.name,
    symbol: c.symbol,
    slug: c.slug.split("-").join("_"),
    num_market_pairs: c.num_market_pairs,
    date_added: c.date_added,
    price: c.quote.USD.price,
    market_cap: c.quote.USD.market_cap,
    volume: c.quote.USD.volume_24h,
    max_supply: c.max_supply,
    circulating_supply: c.circulating_supply,
    total_supply: c.total_supply,
    cmc_rank: c.cmc_rank,
    last_updated: c.last_updated
  }));

  // done.forEach(s => console.log(s.symbol));
  await pg.batchInsert("crypto", done);
})();
