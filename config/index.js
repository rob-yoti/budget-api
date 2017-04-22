let env = process.env.NODE_ENV || 'development';
let configFilePath = `./envs/${env}.json`;
let config = require(configFilePath);

module.exports = {
    config
}