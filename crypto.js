//
//
//
//
//
//
const axios = require("axios");
const pg = require("./database");
const delay = time => {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
};

const scraper = async () => {
  try {
    const model = {};
    model.name = "crypto";
    // for (let i = 0; i < 100; i++) {
    const link = `https://web-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=USD,BTC&cryptocurrency_type=all&limit=5000&sort=market_cap&sort_dir=desc&start=1`;
    const coins = await axios(link);
    console.log(coins.data.data.length);

    coins.data.data.forEach(async dt => {
      delete dt.platform;
      delete dt.quote;
      delete dt.tags;

      const scrapedA = await pg(model.name)
        .where({ id: dt.id })
        .select("*");
      const scraped = scrapedA[0];
      // console.log(scraped);
      if (!scraped) {
        console.log(`Created ${dt.name}`);
        await pg(model.name).insert(dt);
      } else {
        await pg(model.name)
          .update(dt)
          .where("id", dt.id);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  // await scraper();
  const tablesRes = await pg.raw(
    "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'"
  );
  const tables = [];
  tablesRes.rows.forEach(tr => tables.push(tr.tablename));
  console.log(tables);
  const res = await pg("crypto")
    .select("*")
    .orderBy("num_market_pairs", "DESC")
    .limit(10);
  console.log(res);
  res.forEach(async c => {
    if (c.slug !== "tether") {
      const name = c.slug.replace("-", "_");
      if (!tables.find(t => name === t)) {
        await pg.schema.createTable(name, function(table) {
          table.timestamp("time");
          // .unique()
          // .primary()
          // .notNullable();
          table.float("open");
          table.float("high");
          table.float("low");
          table.float("close");
          table.float("volume");
          table.timestamp("close_time");
          table.float("quote");
          table.integer("number_of_trades");
          table.float("taker_buy_base");
          table.float("taker_buy_quote");
          table.float("ignore");
        });
      }
    }
  });
})();
