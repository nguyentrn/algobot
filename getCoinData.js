//
//
//
//
//
//
const scraper = require("./binanceChart");
const pg = require("./database");
const delay = time => {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
};

(async () => {
  const total = await pg("crypto")
    .select(["slug", "symbol"])
    .orderBy("num_market_pairs", "DESC")
    .limit(10);
  console.log(total);
  total.forEach(async coin => {
    if (coin.symbol === "USDT") {
      return;
    }
    await scraper({ name: coin.slug.replace("-", "_"), symbol: coin.symbol });
  });
  return 0;
})();
