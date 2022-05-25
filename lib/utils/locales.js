'use strict';

const path = require('path');
const fs = require('fs');

function findAllLocales(basePath) {
    const results = new Map();
    if (fs.existsSync(basePath)) {
        const locales = fs.readdirSync(basePath)
            .map(name => path.join(basePath, name))
            .filter(folder => fs.lstatSync(folder).isDirectory);
        locales.forEach(locale => {
            const name = path.basename(locale);
            if (name !== 'default') {
                results.set(name, locale);
            }
        });
    }

    return results;
}

module.exports = {
    findAllLocales
};
