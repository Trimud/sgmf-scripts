'use strict';
const cartridge = require('../../../../lib/utils/cartridge');
const assert = require('chai').assert;
const path = require('path');

describe('cartridges', () => {
    it('should return cartridge name', () => {
        const cartridgeName = cartridge.getCartridgeName(path.resolve(__dirname, '../../../fixtures/paths/base'));
        assert.equal(cartridgeName, 'base');
    });

    it('should return packageName if name is not available', () => {
        const cartridgeName = cartridge.getCartridgeName(path.resolve(__dirname, '../../../fixtures/paths/cartridgeA'));
        assert.equal(cartridgeName, 'cartridgeA');
    });

    it('should return random string if no name is available', () => {
        const cartridgeName = cartridge.getCartridgeName(path.resolve(__dirname, '../../../fixtures/paths/entry'));
        assert.equal(cartridgeName.length, 5);
    });

    it('should return null if can not determine cartridge name', () => {
        const cartridgeName = cartridge.getCartridgeName(path.resolve(__dirname, '../../../fixtures/paths'));
        assert.isNull(cartridgeName);
    });

    it('should return cartridge name based on file', () => {
        const map = new Map([['base', path.resolve(__dirname, '../../../fixtures/paths/base/cartridge')]]);
        const cartrideName = cartridge.getCartridgeFromFile(path.resolve(__dirname, '../../../fixtures/paths/base/test/testFile2.js'), map);
        assert.equal(cartrideName.name, 'base');
    });

    it('should return null if cartirdge is not in the list', () => {
        const map = new Map();
        const cartrideName = cartridge.getCartridgeFromFile(path.resolve(__dirname, '../../../fixtures/paths/base/test/testFile2.js'), map);
        assert.isNull(cartrideName);
    });
});
