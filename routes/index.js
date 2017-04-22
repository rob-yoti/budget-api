const { registerUser, loginUser } = require('../controllers/auth.controller');
const { getUserFromToken } = require ('../controllers/user.controller.js');
const { getHealthcheck } = require('../controllers/utils.controller');

function router(server) {
    server.post('/api/register', registerUser);
    server.post('/api/login', loginUser);
    server.get('/api/healthcheck', getHealthcheck);

    server.get('/api/users/me', getUserFromToken);
}

module.exports = {
    router
}
