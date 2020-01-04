const pg = require("./database");

const getList = (model, datas) => {
  const res = datas.map(dt => ({
    time: new Date(dt[0]),
    open: dt[1],
    high: dt[2],
    low: dt[3],
    close: dt[4],
    volume: dt[5]
  }));
  return res;
};

const insert = async (model, datas) => {
  const res = getList(model, datas);
  await pg.batchInsert(model.name, res).returning("time");
};

module.exports = insert;
