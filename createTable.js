//
//
//
//
//
//
const pg = require("./database");
const delay = time => {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
};

const createTable = async exchange => {
  const tablesRes = await pg.raw(
    "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'"
  );
  const tables = [];
  tablesRes.rows.forEach(tr => tables.push(tr.tablename));
  console.log(tables);
  const res = await pg("crypto")
    .select("*")
    .orderBy("cmc_rank")
    .limit(100)
    .offset(1);
  res.forEach(async c => {
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
  await createTable("binance");
  await createTable("bitmex");
})();
