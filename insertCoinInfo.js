const pg = require("./database");

// const scrapedA = await pg(model.name)
//   .where({ time: new Date(dt[0]) })
//   .select("*");
// const scraped = scrapedA[0];
// if (!scraped) {
const getList = (model, datas) => {
  const res = datas.map(
    dt => ({
      time: new Date(dt[0]),
      open: dt[1],
      high: dt[2],
      low: dt[3],
      close: dt[4],
      volume: dt[5],
      close_time: new Date(dt[6]),
      quote: dt[7],
      number_of_trades: dt[8],
      taker_buy_base: dt[9],
      taker_buy_quote: dt[10],
      ignore: dt[11]
    })
    //
  );
  return res;
};

const insert = async (model, datas) => {
  const res = getList(model, datas);
  await pg.batchInsert(model.name, res).returning("time");
};

module.exports = insert;
