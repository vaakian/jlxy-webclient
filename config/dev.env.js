'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: "'http://huanchuang.redpoint178.com'", // node生产模式填充,
  LOGIC_API: "'http://hdgame.joyegame.com:3010'",
  APP_SECRET: "'f13d64f06c0dff09f377484cda9f0e5f'"
})
