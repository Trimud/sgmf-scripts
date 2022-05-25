'use strict'

const webpackConfig = require('./webpackConfig');
const path = require('path');
const fs = require('fs');
const helpers = require('../helpers');

const cwd = process.cwd();

var scssFiles = helpers.createScssPath();

function getNames() {
    return Object.keys(scssFiles).map(
        function(fileKey) {
            let pathLevels = fileKey.split(path.sep);
            return 'scss-' + pathLevels.shift() + '-' + pathLevels.pop();
        }
    );
}

function getEntry(name) {
    let entry = {};
    let fileKey = Object.keys(scssFiles).find(
        function(fileKey) {
            let pattern = new RegExp(name.replace(/^scss-.+?-/,'') + '$');
            return pattern.test(fileKey);
        }
    );

    entry[fileKey] = scssFiles[fileKey];
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

            var scssConfig = Object.assign({}, webpackConfig(packageFile, cwd, 'scss', path));
            if (typeof scssConfig === Error) {
                return;
            }
            scssConfig.name = name;
            scssConfig.entry = entry;
            configs.push(scssConfig);
        }
    );

    return configs;
}

module.exports = {
    getConfigs
};