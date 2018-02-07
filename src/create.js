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
  run();
} catch (error) {
  console.log(error);
}
// FUNCTIONS
function run() {
  sql.connect(config).then(pool => {
    const query = `
    DROP table Persons;
    CREATE TABLE Persons (
        PersonID int,
        LastName varchar(255),
        FirstName varchar(255),
        Address varchar(255),
        City varchar(255));
    INSERT INTO [testmssql].[dbo].[Persons] (PersonID,LastName,FirstName,Address,City)
    VALUES (1,'Saker','Alex','Rue basse','Mougins'),(2,'Joe','Billy','Rue haute','Mougins')`;
    console.time("Creation/Insertion time");
    const request = new sql.Request()
      .query(query)
      .then(res => {
        console.timeEnd("Creation/Insertion time");
        pool.close();
        process.exit(0);
      })
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
  });
}
