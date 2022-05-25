'use strict';

const path = require('path');
const fs = require('fs');
const mapHelper = require('./map');

function getAllUnderlays(packageFile, cwd, map) {
    const result = map || new Map();
    if (packageFile.paths) {
        Object.keys(packageFile.paths).forEach((item => {
            if (!result.has(item)) {
                const cartridge = path.resolve(cwd, packageFile.paths[item]);
                result.set(item, path.join(cartridge, 'cartridge'));

                const innerPackageFile = path.join(cartridge, 'package.json');
                if (fs.existsSync(innerPackageFile)) {
                    const innerPackage = require(innerPackageFile);
                    const newUnderlays = getAllUnderlays(innerPackage, cwd, result);
                    mapHelper.concat(result, newUnderlays);
                }
            } else {
                result.delete(item);
                result.set(item, path.join(path.resolve(cwd, packageFile.paths[item]), 'cartridge'));
            }
        }));
    }

    return result;
}

function getUnderlaysForDir(dir) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
        const packageFile = require(path.join(dir, 'package.json'));
        return getAllUnderlays(packageFile, dir);
    }
    return new Map();
}

function isUnderlay(primary, secondary, list) {
    const iterator = list.entries();
    let primaryFound = false;

    for (const item of iterator) {
        if (item[0] === primary) {
            primaryFound = true;
        }
        if (item[0] === secondary) {
            return primaryFound;
        }
    }

    return false;
}

module.exports = {
    getAllUnderlays,
    getUnderlaysForDir,
    isUnderlay
};
