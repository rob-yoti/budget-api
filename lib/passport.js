const Local = require('passport-local');
const { User } = require('../models/user.model');

// Error messages
const ALREADY_EXISTS = 'Username already exists.';
const PASSWORD_TOO_SHORT = 'Password must be at least 6 characters.';

let handleResponse = function(username, password, done, user) {
    if (user) {
        return done(null, false, { message: ALREADY_EXISTS });
    }

    let newUser = new User();
    newUser.username = username;
    newUser.password = User.encrypt(password);
    newUser.save()
        .then((user) => done(null, user))
        .catch((err) => done(err, false, {message: err}))
}

function localStratagy(passportLocal) {
    passportLocal.use('local', new Local({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    },
    (req, username, password, done) => {
        if (password.length < 6) {
            return done(null, false, { message: PASSWORD_TOO_SHORT });
        }

        User.findOne({ username })
            .then(handleResponse.bind(null, username, password, done))
            .catch((err) => {
                return done(err, false, { message: err })
            })
    }))
}

module.exports = {
    localStratagy
}
