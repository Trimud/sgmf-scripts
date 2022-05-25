'use strict';

const output = {};
output.webpack = require('webpack');
output['extract-text-webpack-plugin'] = require('extract-text-webpack-plugin');
output.createJsPath = require('./lib/helpers').createJsPath;
output.createScssPath = require('./lib/helpers').createScssPath;

module.exports = output;
