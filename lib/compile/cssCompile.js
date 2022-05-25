'use strict';

const webpack = require('webpack');
const multiScssConfigs = require('../../lib/utils/multiScssConfigs');

module.exports = (packageFile, cwd, callback) => {
    webpack(multiScssConfigs.getConfigs(), (err, stats) => {
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
