'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_BASE: '"http://localhost:64398"',
  // API_BASE: '"http://192.168.1.156/Postab"',
})
