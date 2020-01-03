const knex = require("knex");

const pg = knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "123",
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
// const mongoose = require("mongoose");
// const Profile = require("./model/profile");

// const DB =
//   "mongodb://nguyen:Nt01113699@157.245.196.34:27017/cdvnu?authSource=admin&w=1";

// // const DB = DB;
// // "mongodb://nguyen:Nt01113699@157.245.196.34/cdvnu?retryWrites=true&w=majority";

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
//   })
//   .then(() => {
//     console.log("DB connect successful !");
//   });
