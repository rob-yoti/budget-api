const jwt = require('jsonwebtoken');
const passport = require('passport');

const { User } = require('../models/user.model');
const { config } = require('../config');

function registerUser(req, res, next) {
    let localStrategy = passport.authenticate('local', (err, user, info) => {

        if (err) {
            let error = new Error(`Unable to register: ${err}`);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        if (info) {
            return res.status(400).json({
                success: false,
                message: info.message
            });
        }

        if (!user) {
            return res.status(409).json({
                success: false,
                message: 'User already registered.'
            });
        }

        let token = jwt.sign({
            data: user._id
        }, config.secret, { expiresIn: 60 * 60 * 24 });

        // Send back the token to the front-end to store
        return res.status(200).json({
            success: true,
            token
        });
    });

    return localStrategy(req, res, next);
}

function loginUser(req, res) {
    User.findOne({ 'username': req.body.username })
        .then((user) => {
            if (!user) {
                return res.status(403).json({
                    success: false,
                    message: 'No account found with provided credentials.'
                });
            }

            if (!user.validPassword(req.body.password)) {
                return res.status(403).json({
                    success: false,
                    message: 'Authentication failed.'
                });
            }

            let token = jwt.sign({
                data: user._id
            }, config.secret, { expiresIn: 60 * 60 * 24 });

            return res.status(200).json({
                success: true,
                token
            });
        })
        .catch((err) => {
            let error = new Error(`Unable to log in: ${err}`);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        })
}

module.exports= {
    registerUser,
    loginUser
}
