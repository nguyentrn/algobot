//
//
//
//
//
//
const scraper = require("./model");
const pg = require("./database");
const delay = time => {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
};

(async () => {
  await scraper({ name: "bitcoin", symbol: "BTC" });
  return 0;
})();
