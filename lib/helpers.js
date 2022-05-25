'use strict';
const shell = require('shelljs');
const path = require('path');
const overlays = require('./utils/overlays');
const { findAllLocales } = require('./utils/locales');
const cwd = process.cwd();
const createAliases = (packageFile, pwd, postFix) => {
    const aliases = {};
    overlays.getAllUnderlays(packageFile, pwd).forEach((value, key) => {
        aliases[key] = postFix ? path.join(value, postFix) : value;
        const locales = findAllLocales(path.join(value, 'client'));
        const lastDirPostFix = postFix ? path.basename(postFix) : '';
        locales.forEach((localePath, locale) => {
            aliases[`${key}/${locale}`] = lastDirPostFix ? path.join(localePath, lastDirPostFix) : localePath;
        });
    });
    return aliases;
};
module.exports = {
    createJsPath: () => {
        const packageJson = require(path.join(cwd, './package.json'));
        let packageNames =  packageJson.jsPaths || packageJson.packageName;
        if(!Array.isArray(packageNames)) {
            packageNames = [packageNames];
        }
        const result = {};
        packageNames.forEach(packageName => {
            const jsFiles = shell.ls(path.join(cwd, `./cartridges/${packageName}/cartridge/client/**/js/*.js`));
            jsFiles.forEach(filePath => {
                let location = path.relative(path.join(cwd, `./cartridges/${packageName}/cartridge/client`), filePath);
                location = location.substr(0, location.length - 3);
                result[location] = filePath;
            });
        });
        return result;
    },
    createScssPath: () => {
        const packageJson = require(path.join(cwd, './package.json'));
        let packageNames =  packageJson.cssPaths || packageJson.packageName;
        if(!Array.isArray(packageNames)) {
            packageNames = [packageNames];
        }
        const result = {};
        packageNames.forEach(packageName => {
            const cssFiles = shell.ls(path.join(cwd, `./cartridges/${packageName}/cartridge/client/**/scss/**/*.scss`));
            cssFiles.forEach(filePath => {
                const name = path.basename(filePath, '.scss');
                if (name.indexOf('_') !== 0) {
                    let location = path.relative(path.join(cwd, `./cartridges/${packageName}/cartridge/client`), filePath);
                    location = location.substr(0, location.length - 5).replace('scss', 'css');
                    result[location] = filePath;
                }
            });
        });
        return result;
    },
    createAliases
};
