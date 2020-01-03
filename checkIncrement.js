//
//
//
//
//
//
const axios = require("axios");
const math = require("mathjs");
const pg = require("./database");
const insert = require("./insertCoinInfo");
const delay = time => {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
};

const checkDataLost = async coin => {
  let total = await pg(coin.name)
    .select("time")
    .orderBy("time");
  // .limit(100);

  let before = new Date(total[0].time).getTime();
  let after = new Date(total[1].time).getTime();
  for (let i = 1; i < total.length; i++) {
    if (after - before === 60000) {
    } else {
      console.log((after - before) / 60000 - 2);
      (async () => {
        const res = await axios(
          `https://www.binance.com/api/v1/klines?symbol=${
            coin.symbol
          }USDT&interval=1m&endTime=${after - 60000}&startTime=${before +
            60000}`
        );
        console.log(res.data.length);
        await insert(coin, res.data);
      })();
    }
    before = after;
    after = total[i + 1] && new Date(total[i + 1].time).getTime();
  }

  console.log("Done !");
  return 0;
};

(async () => {
  const total = await pg("crypto")
    .select(["slug", "symbol"])
    .orderBy("num_market_pairs", "DESC")
    .limit(10);
  const coins = total.map(dt => ({
    name: dt.slug.replace("-", "_"),
    symbol: dt.symbol
  }));
  console.log(coins);
  for (let i = 0; i < coins.length; i++) {
    await checkDataLost(coins[i]);
  }
})();
