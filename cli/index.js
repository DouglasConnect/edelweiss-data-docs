"use strict";

require('yargs')
  .option('url', {
    describe: 'Base edelweiss url',
    default: "https://api.edelweissdata.com",
  })
  .command(require('./auth.js'))
  .demandCommand()
  .argv

function authCmd(args) {
  console.log(args);
}
