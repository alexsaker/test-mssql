const sql = require("mssql");
const Promise = require("bluebird");
const fs = require("fs");
const MsSQLErrors = require("./errors");

const config = {
  user: "sa",
  password: "mssqlPassword",
  server: "localhost", // You can use 'localhost\\instance' to connect to named instance
  database: "testmssql",
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 30000
  },
  requestTimeout: 0,
  connectionTimeout: 1000
};
try {
  let withPoolCreation = false;
  run(withPoolCreation);
} catch (error) {
  console.log(error);
}
// FUNCTIONS
function run(withPoolCreation) {
  let myPool;
  if (withPoolCreation) {
    //WITH POOL CREATING POOL CONNECTION
    myPool = new sql.ConnectionPool(config);
    myPool
      .connect()
      .then(pool => {
        console.time("Select Time");
        return selectAllUsersWithPool(pool);
      })
      .then(res => {
        console.log(
          "Number of elements gathered: " + res.recordsets[0][0]["count"]
        );
        console.timeEnd("Select Time");
        myPool.close();
        process.exit(0);
      })
      .catch(err => {
        MsSQLErrors.handleErrors(err);
        process.exit(1);
      });
  } else {
    //WITHOUT POOL CREATING POOL CONNECTION

    sql
      .connect(config)
      .then(pool => {
        myPool = pool;
        console.time("Select Time");
        return selectAllUsers().then(res => {
          console.log(
            "Number of elements gathered: " + res.recordsets[0][0]["count"]
          );
          console.timeEnd("Select Time");
          myPool.close();
          process.exit(0);
        });
      })
      .catch(err => {
        MsSQLErrors.handleErrors(err);
        process.exit(1);
      });
  }
}

function selectAllUsers() {
  return new sql.Request()
    .input("id", sql.UniqueIdentifier)
    .input("company", sql.VarChar)
    .input("email", sql.VarChar)
    .input("about", sql.NVarChar)
    .input("friends", sql.NVarChar)
    .input("favoriteFruit", sql.VarChar)
    .query(
      `SELECT COUNT(@id) AS 'count' FROM [testmssql].[dbo].[TestUser];SELECT @id,@company,@email,@about,@friends,@favoriteFruit FROM  [testmssql].[dbo].[TestUser]`
    );
}

function selectAllUsersWithPool(pool) {
  return new sql.Request(pool)
    .input("id", sql.UniqueIdentifier)
    .input("company", sql.VarChar)
    .input("email", sql.VarChar)
    .input("about", sql.NVarChar)
    .input("friends", sql.NVarChar)
    .input("favoriteFruit", sql.VarChar)
    .query(
      `SELECT COUNT(@id)  AS 'count' FROM [testmssql].[dbo].[TestUser];SELECT @id,@company,@email,@about,@friends,@favoriteFruit FROM  [testmssql].[dbo].[TestUser]`
    );
}

sql.on("error", err => {
  MsSQLErrors.handleErrors(err);
});
