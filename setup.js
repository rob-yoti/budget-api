const bodyParser = require('body-parser');
const chalk = require('chalk');
const cors = require('cors');
const expressJwt = require('express-jwt');
const helmet = require('helmet');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');

const { config } = require('./config');
const { localStratagy } = require('./lib/passport');
const { router } = require('./routes');

function setupServer(server) {
    return new Promise((resolve, reject) => {
        try {
            // Allow use of PUT and DELETE
            server.use(methodOverride((req, res) => {
                if (req.body && typeof req.body === 'object' && '_method' in req.body) {
                    let method = req.body._method;
                    delete req.body._method;
                    return method;
                }
            }));

            // Parse incoming requests -> req.body
            server.use(bodyParser.json());
            server.use(bodyParser.urlencoded({
                extended: true
            }));

            // Allow cross-origin requests
            server.use(cors());
            server.use(function (req, res, next) {
                res.header('Access-Control-Allow-Origin', req.headers.origin);
                res.header('Access-Control-Allow-Credentials', 'true');
                next();
            });

            // Server security
            server.use(helmet());

            // Initialize passport for local authentication
            localStratagy(passport);

            // Set up JSON Web Tokens
            server.use(expressJwt({ secret: config.secret })
                .unless({
                    path: [
                        { url: '/api/register', methods: ['POST'] },
                        { url: '/api/login', methods: ['POST'] },
                        { url: '/api/healthcheck', methods: ['GET'] }
                    ]
                })
            );

            // Required to prevent app crash on unauthorized requests
            server.use(function(err, req, res, next) {
                if (err.name === 'UnauthorizedError') {
                    return res.status(401).json({
                        success: false,
                        message: 'Unauthorized request.'
                    });
                }
                next();
            });

            // Routes
            router(server);

            // All done
            resolve(server);

        } catch (error) {
            reject(error);
        }
    });
}

function connectToMongo() {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.databaseUri)
            .then(() => {
                console.log(chalk.cyan(`MongoDB connection established at ${config.databaseUri}`));
                resolve();
            })
            .catch((err) => {
                reject(`Problem connecting to MongoDB: ${err}`)
            })
    });
}

module.exports = {
    setupServer,
    connectToMongo
}
