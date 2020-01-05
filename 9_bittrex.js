const ccxt = require("ccxt");
const pg = require("./database");
const upsert = require("./upsert");
const getBtc = require("./getCoinFactory");

const exchangeId = "bittrex",
  exchangeClass = ccxt[exchangeId],
  exchange = new exchangeClass({
    apiKey: "ad7b9267f14f47338491cc16274c8e29",
    secret: "aa2e30bc6c5d4b2ea263b47aa11b4313",
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
    .offset(100);
  for (let i = 0; i < coins.length; i++) {
    const trade = `${coins[i].symbol}/BTC`;
    let s = null;
    if (
      coins[i].slug !== "bittorrent" &&
      coins[i].slug !== "cosmos" &&
      coins[i].slug !== "crypto_com" &&
      coins[i].slug !== "crypto_com_coin" &&
      coins[i].slug !== "grin" &&
      coins[i].slug !== "hedgetrade" &&
      coins[i].slug !== "iostoken" &&
      coins[i].slug !== "luna" &&
      coins[i].slug !== "maker" &&
      coins[i].slug !== "maidsafecoin" &&
      coins[i].slug !== "omisego" &&
      coins[i].slug !== "ontology" &&
      coins[i].slug !== "quant" &&
      coins[i].slug !== "qtum" &&
      coins[i].slug !== "rlc" &&
      coins[i].slug !== "status" &&
      coins[i].slug !== "synthetix_network_token" &&
      coins[i].slug !== "vechain" &&
      coins[i].slug !== "zilliqa"
    ) {
      s = prd.find(c => c.name === trade);
    }

    if (s) {
      console.log(`Find ${coins[i].slug}`);
      await getBtc(
        exchange,
        {
          name: coins[i].slug.concat(`_${exchangeId}`),
          symbol: trade
        },
        s.key
      );
    } else {
      console.log(`CANT NOT FIND ${coins[i].slug}`);
    }
  }
})();
