'use strict';

const path = require('path');
const helpers = require('../helpers');
const fs = require('fs');
const deepMerge = require('../utils/deepMerge');

const typeMapping = {
    js: '/client/default/js',
    scss: '/client/default/scss'
};

module.exports = (packageFile, cwd, configType, entry) => {
    const aliases = helpers.createAliases(packageFile, cwd, typeMapping[configType]);
    const webpackConfigFile = path.join(cwd, './webpack.config.js');
    if (fs.existsSync(webpackConfigFile)) {
        const webpackConfig = require(webpackConfigFile);

        const config = webpackConfig(entry).find(item => item.name === configType);

        if (config) {
            let newResolve = {
                alias: aliases,
                extensions: [`.${configType}`]
            };

            if (config.resolve) {
                newResolve = deepMerge(config.resolve, newResolve);
            }
            config.resolve = newResolve;
            return config;
        }
        return new Error(`Could not find webpack configuration with the name "${configType}"`);
    }
    return new Error('Could not find webpack.config.js file');
};
