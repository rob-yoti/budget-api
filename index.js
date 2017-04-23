const express = require('express');
const chalk = require('chalk');

const { config } = require('./config');
const { setupServer, connectToMongo } = require('./setup');

let app = express();
let port = process.env.PORT || config.port || 5001;

let startServer = function(server) {
    server.listen(port, () => {
        console.log(chalk.green('Server listening on port: '), chalk.yellow(port));
    });
}

connectToMongo()
    .then(setupServer.bind(null, app))
    .then(startServer)
    .catch((err) => {
        console.error(chalk.red('----------------------'));
        console.error(chalk.red('SERVER UNABLE TO START'));
        console.error(chalk.red('----------------------'));
        console.error(chalk.red(err));
        process.exit(1);
    })
