'use strict';

const path = require('path');
const fs = require('fs');

function generateRandomName() {
    return [...Array(10)].map(() => Math.random().toString(36)[3]).join('');
}

function getCartridgeName(dir) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
        const packageFile = require(path.join(dir, 'package.json'));
        return packageFile.packageName || packageFile.name || generateRandomName();
    }
    return null;
}

function getCartridgeFromFile(file, list) {
    for (const item of list.entries()) {
        if (file.indexOf(path.join(item[1], '../../../')) >= 0) {
            return { name: item[0], path: item[1] };
        }
    }
    return null;
}

function getTestRelPath(file, cartridge) {
    return path.relative(path.join(cartridge, '..'), file);
}

module.exports = {
    getCartridgeName,
    getCartridgeFromFile,
    getTestRelPath
};
