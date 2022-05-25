'use strict';
const webpack = require('webpack');
const multiJSConfigs = require('../../lib/utils/multiJSConfigs');

module.exports = (packageFile, cwd, callback) => {
    webpack(multiJSConfigs.getConfigs(), (err, stats) => {
        if (err) {
            console.error(err);
            callback(1);
            return;
        }
        console.log(stats.toString({
            chunks: false,
            colors: true
        }));
        callback(0);
    });
};
