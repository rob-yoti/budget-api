const { registerUser, loginUser } = require('../controllers/auth.controller');
const { getTransaction, createTransaction, deleteTransaction } = require('../controllers/transaction.controller');
const { getUser } = require ('../controllers/user.controller');
const { getHealthcheck } = require('../controllers/utils.controller');

function router(server) {
    server.post('/api/register', registerUser);
    server.post('/api/login', loginUser);
    server.get('/api/healthcheck', getHealthcheck);

    server.get('/api/user', getUser);

    server.get('/api/transaction/:id', getTransaction);
    server.delete('/api/transaction/:id', deleteTransaction);
    server.post('/api/transaction', createTransaction);
}

module.exports = {
    router
}
