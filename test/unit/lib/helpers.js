'use strict';

const assert = require('chai').assert;
const path = require('path');
const helpers = require('../../../lib/helpers');

describe('aliases', () => {
    it('should find all correct file path', () => {
        const aliases = helpers.createAliases(require('../../fixtures/paths/entry/package.json'), path.resolve(__dirname, '../../fixtures/paths/entry'));

        assert.equal(Object.keys(aliases).length, 5);
        assert.isNotNull(aliases['cartridgeA/en_GB']);
        assert.isUndefined(aliases['cartridgeA/default']);
        assert.isTrue(aliases.cartridgeA.indexOf('/js') === -1);
    });

    it('should create all aliases with corret postFix', () => {
        const aliases = helpers.createAliases(require('../../fixtures/paths/entry/package.json'), path.resolve(__dirname, '../../fixtures/paths/entry'), '/client/default/js');
        assert.equal(Object.keys(aliases).length, 5);
        assert.isTrue(aliases.cartridgeA.indexOf('/cartridge/client/default/js') >= 0);
        assert.isTrue(aliases['cartridgeA/en_GB'].indexOf('/cartridge/client/en_GB/js') >= 0);
    });
});
