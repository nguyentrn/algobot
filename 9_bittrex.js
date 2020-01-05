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
    .offset(1);
  for (let i = 0; i < coins.length; i++) {
    const trade = `${coins[i].symbol}/BTC`;
    let s = null;
    if (
      coins[i].slug !== "adx_net" &&
      coins[i].slug !== "aelf" &&
      coins[i].slug !== "ankr" &&
      coins[i].slug !== "aragon" &&
      coins[i].slug !== "bancor" &&
      coins[i].slug !== "bittorrent" &&
      coins[i].slug !== "bnktothefuture" &&
      coins[i].slug !== "bora" &&
      coins[i].slug !== "btu_protocol" &&
      coins[i].slug !== "cindicator" &&
      coins[i].slug !== "civic" &&
      coins[i].slug !== "contents_protocol" &&
      coins[i].slug !== "cortex" &&
      coins[i].slug !== "cosmos" &&
      coins[i].slug !== "crypto_com" &&
      coins[i].slug !== "crypto_com_coin" &&
      coins[i].slug !== "dent" &&
      coins[i].slug !== "dmarket" &&
      coins[i].slug !== "dusk_network" &&
      coins[i].slug !== "dragonchain" &&
      coins[i].slug !== "enigma" &&
      coins[i].slug !== "factom" &&
      coins[i].slug !== "firstblood" &&
      coins[i].slug !== "flexacoin" &&
      coins[i].slug !== "function_x" &&
      coins[i].slug !== "fusion" &&
      coins[i].slug !== "gifto" &&
      coins[i].slug !== "gnosis_gno" &&
      coins[i].slug !== "gochain" &&
      coins[i].slug !== "grin" &&
      coins[i].slug !== "hedgetrade" &&
      coins[i].slug !== "hydrogen" &&
      coins[i].slug !== "incent" &&
      coins[i].slug !== "iostoken" &&
      coins[i].slug !== "iotex" &&
      coins[i].slug !== "lambda" &&
      coins[i].slug !== "libra_credit" &&
      coins[i].slug !== "loopring" &&
      coins[i].slug !== "luna" &&
      coins[i].slug !== "maker" &&
      coins[i].slug !== "maidsafecoin" &&
      coins[i].slug !== "mainframe" &&
      coins[i].slug !== "medibloc" &&
      coins[i].slug !== "nkn" &&
      coins[i].slug !== "nxt" &&
      coins[i].slug !== "nucleus_vision" &&
      coins[i].slug !== "ocean_protocol" &&
      coins[i].slug !== "omisego" &&
      coins[i].slug !== "ontology" &&
      coins[i].slug !== "orbs" &&
      coins[i].slug !== "ost" &&
      coins[i].slug !== "particl" &&
      coins[i].slug !== "planet" &&
      coins[i].slug !== "playchip" &&
      coins[i].slug !== "pundi_x" &&
      coins[i].slug !== "quant" &&
      coins[i].slug !== "qtum" &&
      coins[i].slug !== "ripio_credit_network" &&
      coins[i].slug !== "rlc" &&
      coins[i].slug !== "status" &&
      coins[i].slug !== "storj" &&
      coins[i].slug !== "stpt" &&
      coins[i].slug !== "susd" &&
      coins[i].slug !== "synthetix_network_token" &&
      coins[i].slug !== "tenx" &&
      coins[i].slug !== "ttc" &&
      coins[i].slug !== "vechain" &&
      coins[i].slug !== "zilliqa"
    ) {
      s = prd.find(c => c.name === trade);
    }

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
