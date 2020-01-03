const knex = require("knex");

const pg = knex({
  client: "pg",
  connection: {
    host: "157.245.196.34",
    user: "nguyen",
    password: "Nt01113699",
    database: "algobot"
  },
  pool: {
    max: 50,
    min: 2,
    // acquireTimeout: 60 * 1000,
    // createTimeoutMillis: 30000,
    // acquireTimeoutMillis: 30000,
    // idleTimeoutMillis: 30000,
    // reapIntervalMillis: 1000,
    // createRetryIntervalMillis: 100,
    propagateCreateError: false // <- default is true, set to false
  }
});
module.exports = pg;
