function handleConnectionErrors(err) {
    switch (err.code) {
        case 'ELOGIN':
            console.error(`[${err.name}] Login Failed: ${err.message}`);
            break;
        case 'ETIMEOUT':
            console.error(`[${err.name}] Connection timeout: ${err.message}`);
            break;
        case 'EDRIVER':
            console.error(`[${err.name}] Unknown driver: ${err.message}`);
            break;
        case 'EALREADYCONNECTED':
            console.error(`[${err.name}] Database is already connected: ${err.message}`);
            break;
        case 'EALREADYCONNECTING':
            console.error(`[${err.name}] Already connecting to database: ${err.message}`);
            break;
        case 'EINSTLOOKUP':
            console.error(`[${err.name}] Instance lookup failed: ${err.message}`);
            break;
        case 'ESOCKET':
            console.error(`[${err.name}] Socket error: ${err.message}`);
            break;
        case 'ECONNCLOSED':
            console.error(`[${err.name}] Connection is closed: ${err.message}`);
            break;
        case 'ENOTOPEN':
            console.error(`[${err.name}] Connection not yet open: ${err.message}`);
            break;
        default:
            console.error(`[${err.name}] ${err.code}: ${err.message}`);
            break;
    }
}
function handleRequestErrors(err) {
    switch (err.code) {
        case 'EREQUEST':
            console.error(`[${err.name}] Message from SQL Server: ${err.message}`);
            break;
        case 'ECANCEL':
            console.error(`[${err.name}] Cancelled: ${err.message}`);
            break;
        case 'ETIMEOUT':
            console.error(`[${err.name}] Request timeout: ${err.message}`);
            break;
        case 'ENOCONN':
            console.error(`[${err.name}] No connection is specified for that request: ${err.message}`);
            break;
        case 'EARGS':
            console.error(`[${err.name}] Invalid number of arguments: ${err.message}`);
            break;
        case 'EINJECT':
            console.error(`[${err.name}] SQL injection warning: ${err.message}`);
            break;
        default:
            console.error(`[${err.name}] ${err.code}: ${err.message}`);
            break;
    }
}
function handleTransactionErrors(err) {
    switch (err.code) {
        case 'EALREADYBEGUN':
            console.error(`[${err.name}] Transaction has already begun: ${err.message}`);
            break;
        case 'ENOTBEGUN':
            console.log(`[${err.name}] Transaction has not begun: ${err.message}`);
            break;
        case 'EREQINPROG':
            console.log(`[${err.name}] Can't commit transaction. There is a request in progress: ${err.message}`);
            break;
        case 'EABORT':
            console.log(`[${err.name}] Transaction has been aborted: ${err.message}`);
            break;
        default:
            console.error(`[${err.name}] ${err.code}: ${err.message}`);
            break;
    }
}

function handlePreparedStatementErrors(err) {
    switch (err.code) {
        case 'EARGS':
            console.error(`[${err.name}] Invalid number of arguments: ${err.message}`);
            break;
        case 'EINJECT':
            console.log(`[${err.name}] SQL injection warning: ${err.message}`);
            break;
        case 'EALREADYPREPARED':
            console.log(`[${err.name}] Statement is already prepared: ${err.message}`);
            break;
        case 'ENOTPREPARED':
            console.log(`[${err.name}] Statement is not prepared: ${err.message}`);
            break;
        default:
            console.error(`[${err.name}] ${err.code}: ${err.message}`);
            break;
    }
}
const handleErrors = (err) => {
    switch (err.name) {
        case 'ConnectionError':
            handleConnectionErrors(err);
            break;
        case 'RequestError':
            handleRequestErrors(err);
            break;
        case 'TransactionError':
            handleTransactionErrors(err);
            break;
        case 'PreparedStatementError':
            handlePreparedStatementErrors(err);
            break;
        default:
            console.error(err);
            break;
    }
};

exports.handleErrors = handleErrors