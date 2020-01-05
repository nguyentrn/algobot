//
//
//
//
//
//
const pg = require("./database");
const ccxt = require("ccxt");
const delay = time => {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
};

const createTable = async exchange => {
  s = new ccxt[exchange]({
    timeout: 30000,
    enableRateLimit: true
  });

  const prdA = await s.loadMarkets();
  const prd = Object.values(prdA)
    .filter(c => c.quote === "BTC")
    .map(c => c.base);
  console.log(Object.values(prdA).length);
  const tablesRes = await pg.raw(
    "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'"
  );
  const tables = [];
  tablesRes.rows.forEach(tr => tables.push(tr.tablename));
  const res = await pg("crypto")
    .select("*")
    .orderBy("cmc_rank")
    .limit(100);
  const x = res.filter(s =>
    s.name === "Bitcoin" ? s : prd.find(c => c === s.symbol)
  );
  console.log(`${exchange} Exchanges created ${x.length} trades`);

  x.forEach(async c => {
    const name = `${c.slug}_${exchange}`;
    if (!tables.find(t => name === t)) {
      await pg.schema.createTable(name, function(table) {
        table
          .timestamp("time")
          .unique()
          .primary()
          .notNullable();
        table.float("open");
        table.float("high");
        table.float("low");
        table.float("close");
        table.float("volume");
        table.index("time", `${name}_time_1`);
      });
    }
  });
};

(async () => {
  // await createTable("bitmex"); //24,860
  // await createTable("binance"); //1687
  await createTable("hitbtc"); //11,933
  // await createTable("liquid"); //21,251
  // await createTable("coinbasepro"); //2079
  // await createTable("kraken"); //8539
  // await createTable("bitfinex"); //8822
  // await createTable("bitstamp"); //16,632
  // await createTable("poloniex"); //7352
  // await createTable("bittrex"); //7580
  // await createTable("gemini"); //26,281
  // await createTable("bitso"); //13,471
  // await createTable("bitflyer"); //2079

  // await createTable("okex"); //3767
  // await createTable("zbcom"); //5694
  // await createTable("upbit"); //9407
  ////////////////////////////await createTable("deribit"); //25,589
})();
