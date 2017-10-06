
const sql = require('mssql');
const Promise = require('bluebird');
const fs = require('fs');
const MsSQLErrors = require('./errors');

const config = {
    user: "sa",
    password: "gsxpassword",
    server: "localhost", // You can use 'localhost\\instance' to connect to named instance
    database: "testmssql",
    pool: {
        max: 100,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    requestTimeout: 0,
    connectionTimeout: 1000

};
const testJson = JSON.parse(fs.readFileSync('./test.json', { encoding: 'utf-8' }));
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
        myPool.connect()
            .then(pool => {
                console.log("Nb of elements to insert: ", testJson.length);
                console.time("Insertion Time");
                return insertAllUsersWithPool(pool, testJson);
            })
            .then(res => {
                console.timeEnd("Insertion Time");
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
                console.log("Nb of elements to insert: ", testJson.length);
                console.time("Insertion Time");
                return insertAllUsers(testJson)
                    .then(res => {
                        console.timeEnd("Insertion Time");
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

function insertInTestUserWithPool(pool, data) {
    return new sql.Request(pool)
        .input('company', sql.VarChar, data.company)
        .input('email', sql.VarChar, data.email)
        .input('about', sql.NVarChar, data.about)
        .input('friends', sql.NVarChar, JSON.stringify(data.friends))
        .input('favoriteFruit', sql.VarChar, data.favoriteFruit)
        .query(`INSERT INTO [testmssql].[dbo].[TestUser]
    (id,company,email,about,friends,favoriteFruit)
    values
    (NEWID(),@company,@email,@about,@friends,@favoriteFruit)`);
}

function insertAllUsers(testJson) {
    return new Promise((resolve, reject) => {
        let outputResults = [];
        let outputErrors = [];
        let promises = [];
        testJson.map(user => promises.push(insertInTestUser(user)));
        Promise
            .all(promises.map(promise => Promise.resolve(promise).reflect()))
            .then(inspections => {
                inspections
                    .map(inspection => {
                        if (inspection.isFulfilled()) {
                            outputResults.push(inspection.value())
                        } else {
                            outputErrors.push(inspection.reason());
                        }
                    })
            })
            .then(() => resolve(outputResults))
            .catch(() => reject(outputErrors));
    });
}


function insertInTestUser(data) {
    return new sql.Request()
        .input('company', sql.VarChar, data.company)
        .input('email', sql.VarChar, data.email)
        .input('about', sql.NVarChar, data.about)
        .input('friends', sql.NVarChar, JSON.stringify(data.friends))
        .input('favoriteFruit', sql.VarChar, data.favoriteFruit)
        .query(`INSERT INTO [testmssql].[dbo].[TestUser]
    (id,company,email,about,friends,favoriteFruit)
    values
    (NEWID(),@company,@email,@about,@friends,@favoriteFruit)`);


}

function insertAllUsersWithPool(pool, testJson) {
    return new Promise((resolve, reject) => {
        let outputResults = [];
        let outputErrors = [];
        let promises = [];
        testJson.map(user => promises.push(insertInTestUserWithPool(pool, user)));
        Promise
            .all(promises.map(promise => Promise.resolve(promise).reflect()))
            .then(inspections => {
                inspections
                    .map(inspection => {
                        if (inspection.isFulfilled()) {
                            outputResults.push(inspection.value());
                        } else {
                            outputErrors.push(inspection.reason());
                        }
                    })
            })
            .then(() => { pool.close(); resolve(outputResults); })
            .catch(() => reject(outputErrors));
    });

}



sql.on('error', err => {
    MsSQLErrors.handleErrors(err);
});
