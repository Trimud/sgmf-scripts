'use strict'

const webpackConfig = require('./webpackConfig');
const path = require('path');
const fs = require('fs');
const helpers = require('../helpers');

const cwd = process.cwd();

var jsFiles = helpers.createJsPath();

function getNames() {
    return Object.keys(jsFiles).map(
        function(fileKey) {
            let pathLevels = fileKey.split(path.sep);
            return 'js-' + pathLevels.shift() + '-' + pathLevels.pop();
        }
    );
}

function getEntry(name) {
    let entry = {};
    let fileKey = Object.keys(jsFiles).find(
        function(fileKey) {
            let pattern = new RegExp(name.replace(/^js-.+?-/,'') + '$');
            return pattern.test(fileKey);
        }
    );
    entry[fileKey] = jsFiles[fileKey];
    return entry;
}

function getPath(entry) {
    let path;
    for (var key in entry) {
        path = entry[key];
        break;
    };

    return path;
}

function getConfigs() {
    const packageFile = require(path.join(cwd, './package.json'));

    let configs = [];
    getNames().forEach(
        function(name) {
            const entry = getEntry(name);
            const path = getPath(entry);

            var jsConfig = Object.assign({}, webpackConfig(packageFile, cwd, 'js', path));
            if (typeof jsConfig === Error) {
                return;
            }
            jsConfig.name = name;
            jsConfig.entry = entry;
            configs.push(jsConfig);
        }
    );

    return configs;
}

module.exports = {
    getConfigs
};