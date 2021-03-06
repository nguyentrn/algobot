const ccxt = require("ccxt");
const pg = require("./database");
const upsert = require("./upsert");
const getBtc = require("./getCoinFactory");

const random = (from, range) => Math.floor(Math.random() * range + from);

const delay = time => {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
};
const exchangeId = "bittrex",
  exchangeClass = ccxt[exchangeId],
  exchange = new exchangeClass({
    apiKey: "ad7b9267f14f47338491cc16274c8e29",
    secret: "aa2e30bc6c5d4b2ea263b47aa11b4313",
    timeout: 30000,
    enableRateLimit: true
  });

(async () => {
  const prdA = await exchange.loadMarkets();
  const prd = Object.entries(prdA).map(c => ({
    key: c[0],
    name: `${c[1].base}/${c[1].quote}`
  }));
  const coins = await pg("crypto")
    .select("*")
    .orderBy("cmc_rank");
  // .limit(500)

  // .offset(500);
  await getBtc(
    exchange,
    { name: "bitcoin".concat(`_${exchangeId}`), symbol: "BTC" },
    "BTC/USDT"
  );

  for (let i = 0; i < coins.length; i++) {
    const trade = `${coins[i].symbol}/BTC`;
    let s = null;
    if (
      coins[i].slug !== "12ships" &&
      coins[i].slug !== "abyss_token" &&
      coins[i].slug !== "adtoken" &&
      coins[i].slug !== "adx_net" &&
      coins[i].slug !== "aelf" &&
      coins[i].slug !== "aergo" &&
      coins[i].slug !== "aidcoin" &&
      coins[i].slug !== "akropolis" &&
      coins[i].slug !== "apm_coin" &&
      coins[i].slug !== "ankr" &&
      coins[i].slug !== "aragon" &&
      coins[i].slug !== "bancor" &&
      coins[i].slug !== "bankex" &&
      coins[i].slug !== "bittorrent" &&
      coins[i].slug !== "blockcloud" &&
      coins[i].slug !== "blocknet" &&
      coins[i].slug !== "blocktrade_token" &&
      coins[i].slug !== "blockv" &&
      coins[i].slug !== "bloc_money" &&
      coins[i].slug !== "blue_whale_exchange" &&
      coins[i].slug !== "bnktothefuture" &&
      coins[i].slug !== "bora" &&
      coins[i].slug !== "brz" &&
      coins[i].slug !== "btu_protocol" &&
      coins[i].slug !== "chromia" &&
      coins[i].slug !== "cindicator" &&
      coins[i].slug !== "civic" &&
      coins[i].slug !== "contents_protocol" &&
      coins[i].slug !== "cortex" &&
      coins[i].slug !== "cosmos" &&
      coins[i].slug !== "cosmo_coin" &&
      coins[i].slug !== "crowd_machine" &&
      coins[i].slug !== "cryptaur" &&
      coins[i].slug !== "crypto_com" &&
      coins[i].slug !== "crypto_com_coin" &&
      coins[i].slug !== "cyber_movie_chain" &&
      coins[i].slug !== "data" &&
      coins[i].slug !== "decent" &&
      coins[i].slug !== "dent" &&
      coins[i].slug !== "district0x" &&
      coins[i].slug !== "dmarket" &&
      coins[i].slug !== "dusk_network" &&
      coins[i].slug !== "dragonchain" &&
      coins[i].slug !== "edgeless" &&
      coins[i].slug !== "enigma" &&
      coins[i].slug !== "factom" &&
      coins[i].slug !== "firmachain" &&
      coins[i].slug !== "firstblood" &&
      coins[i].slug !== "fleta" &&
      coins[i].slug !== "flexacoin" &&
      coins[i].slug !== "fnb_protocol" &&
      coins[i].slug !== "function_x" &&
      coins[i].slug !== "fusion" &&
      coins[i].slug !== "gamecredits" &&
      coins[i].slug !== "gifto" &&
      coins[i].slug !== "gnosis_gno" &&
      coins[i].slug !== "gochain" &&
      coins[i].slug !== "grin" &&
      coins[i].slug !== "guppy" &&
      coins[i].slug !== "hdac" &&
      coins[i].slug !== "hedgetrade" &&
      coins[i].slug !== "hxro" &&
      coins[i].slug !== "humaniq" &&
      coins[i].slug !== "hycon" &&
      coins[i].slug !== "hydrogen" &&
      coins[i].slug !== "iht_real_estate_protocol" &&
      coins[i].slug !== "incent" &&
      coins[i].slug !== "ion" &&
      coins[i].slug !== "iostoken" &&
      coins[i].slug !== "iotex" &&
      coins[i].slug !== "jibrel_network" &&
      coins[i].slug !== "lambda" &&
      coins[i].slug !== "libra_credit" &&
      coins[i].slug !== "loopring" &&
      coins[i].slug !== "luna" &&
      coins[i].slug !== "luna_coin" &&
      coins[i].slug !== "maecenas" &&
      coins[i].slug !== "maker" &&
      coins[i].slug !== "maidsafecoin" &&
      coins[i].slug !== "mainframe" &&
      coins[i].slug !== "medibloc" &&
      coins[i].slug !== "metadium" &&
      coins[i].slug !== "metronome" &&
      coins[i].slug !== "morpheus_network" &&
      coins[i].slug !== "moss_coin" &&
      coins[i].slug !== "naga" &&
      coins[i].slug !== "nkn" &&
      coins[i].slug !== "nolimitcoin" &&
      coins[i].slug !== "nxt" &&
      coins[i].slug !== "nucleus_vision" &&
      coins[i].slug !== "ocean_protocol" &&
      coins[i].slug !== "omisego" &&
      coins[i].slug !== "ongsocial" &&
      coins[i].slug !== "ontology" &&
      coins[i].slug !== "ontology_gas" &&
      coins[i].slug !== "orbs" &&
      coins[i].slug !== "origintrail" &&
      coins[i].slug !== "ost" &&
      coins[i].slug !== "pal_network" &&
      coins[i].slug !== "particl" &&
      coins[i].slug !== "patientory" &&
      coins[i].slug !== "pchain" &&
      coins[i].slug !== "pixel" &&
      coins[i].slug !== "plair" &&
      coins[i].slug !== "planet" &&
      coins[i].slug !== "playchip" &&
      coins[i].slug !== "pledge_coin" &&
      coins[i].slug !== "potcoin" &&
      coins[i].slug !== "prometeus" &&
      coins[i].slug !== "pton" &&
      coins[i].slug !== "pumapay" &&
      coins[i].slug !== "pundi_x" &&
      coins[i].slug !== "quant" &&
      coins[i].slug !== "quantum_resistant_ledger" &&
      coins[i].slug !== "qtum" &&
      coins[i].slug !== "refereum" &&
      coins[i].slug !== "ripio_credit_network" &&
      coins[i].slug !== "rlc" &&
      coins[i].slug !== "salus" &&
      coins[i].slug !== "sentinel_protocol" &&
      coins[i].slug !== "sirin_labs_token" &&
      coins[i].slug !== "six" &&
      coins[i].slug !== "smartlands" &&
      coins[i].slug !== "social_lending_token" &&
      coins[i].slug !== "spacechain" &&
      coins[i].slug !== "spin_protocol" &&
      coins[i].slug !== "status" &&
      coins[i].slug !== "storj" &&
      coins[i].slug !== "storm" &&
      coins[i].slug !== "stpt" &&
      coins[i].slug !== "susd" &&
      coins[i].slug !== "synthetix_network_token" &&
      coins[i].slug !== "tap" &&
      coins[i].slug !== "temco" &&
      coins[i].slug !== "tenx" &&
      coins[i].slug !== "ttc" &&
      coins[i].slug !== "tutors_diary" &&
      coins[i].slug !== "uptoken" &&
      coins[i].slug !== "uranus" &&
      coins[i].slug !== "utrust" &&
      coins[i].slug !== "vechain" &&
      coins[i].slug !== "veriblock" &&
      coins[i].slug !== "viberate" &&
      coins[i].slug !== "vite" &&
      coins[i].slug !== "vodi_x" &&
      coins[i].slug !== "w_green_pay" &&
      coins[i].slug !== "xel" &&
      coins[i].slug !== "xensor" &&
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
        s.key,
        true
      );
      await delay(random(1000, 1000));
    } else {
    }
  }
})();
