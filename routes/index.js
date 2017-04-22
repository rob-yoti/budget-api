const { registerUser, loginUser } = require('../controllers/auth.controller');
const { getHealthcheck } = require('../controllers/utils.controller');

function router(server) {
    server.post('/api/register', registerUser);
    server.post('/api/login', loginUser);
    server.get('/api/healthcheck', getHealthcheck);
}

module.exports = {
    router
}
