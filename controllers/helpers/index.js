const jwt = require('jsonwebtoken');

const { config } = require('../../config');

function getUserIdFromToken(header) {
    let token = header.split(' ')[1];
    let decoded = jwt.verify(token, config.secret);
    let userId = decoded.data;

    return userId;
}

module.exports = {
    getUserIdFromToken
}
