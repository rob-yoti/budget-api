const jwt = require('jsonwebtoken');

const { config } = require('../config');
const { User } = require('../models/user.model');

function getUserFromToken(req, res) {
    let authHeader = req.headers.authorization;
    let token = authHeader.split(' ')[1];
    let decoded = jwt.verify(token, config.secret);
    let userId = decoded.data;

    User.findById(userId)
        .then((user) => {
            return res.status(200).json({
                success: true,
                user
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err
            });
        })
}

module.exports = {
    getUserFromToken
}
