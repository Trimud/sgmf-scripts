const path = require('path');

module.exports = [{
    mode: 'production',
    name: 'js',
    resolve: {
        alias: {
            jquery: path.resolve(__dirname, '../storefront-reference-architecture/node_modules/jquery')
        }
    }
}, {
    mode: 'none',
    name: 'scss',
    resolve: {
        alias: {
            bootstrap: path.resolve(__dirname, '../storefront-reference-architecture/node_modules/bootstrap')
        }
    }
}];
