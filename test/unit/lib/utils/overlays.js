'use strict';

const assert = require('chai').assert;
const path = require('path');
const overlays = require('../../../../lib/utils/overlays');

describe('Create a list of underlays', () => {
    it('Should return empty map if no paths exist', () => {
        const paths = overlays.getAllUnderlays({}, __dirname);

        assert.equal(paths.size, 0);
    });

    it('Should return a single item', () => {
        const paths = overlays.getAllUnderlays({ paths: { base: '../' } }, __dirname);

        assert.equal(paths.size, 1);
        assert.equal(paths.get('base'), path.join(__dirname, '../', 'cartridge'));
    });

    it('Should return multiple items in the right order', () => {
        const pwd = path.resolve(__dirname, '../../../fixtures/paths/entry');
        const paths = overlays.getAllUnderlays(require('../../../fixtures/paths/entry/package.json'), pwd);
        assert.equal(paths.size, 2);
        const iterator = paths.keys();
        assert.equal(iterator.next().value, 'base');
        assert.equal(iterator.next().value, 'cartridgeA');

        assert.equal(path.relative(pwd, paths.get('base')), '../base/cartridges/base/cartridge');
    });

    it('Should return all underlays for a directory', () => {
        const paths = overlays.getUnderlaysForDir(path.resolve(__dirname, '../../../fixtures/paths/cartridgeB'));

        assert.equal(paths.size, 1);
        const iterator = paths.keys();
        assert.equal(iterator.next().value, 'cartridgeC');
    });

    it('Should return empty map if dir is not a valid cartridge parent', () => {
        const paths = overlays.getUnderlaysForDir(path.resolve(__dirname, '../../../fixtures/paths/cartridgeB/test'));

        assert.equal(paths.size, 0);
    });

    it('Should return true if one cartridge is underlayed by another', () => {
        const pwd = path.resolve(__dirname, '../../../fixtures/paths/entry');
        const paths = overlays.getAllUnderlays(require('../../../fixtures/paths/entry/package.json'), pwd);
        assert.isTrue(overlays.isUnderlay('base', 'cartridgeA', paths));
    });

    it('Should return false if one cartridge is overlayed by another', () => {
        const pwd = path.resolve(__dirname, '../../../fixtures/paths/entry');
        const paths = overlays.getAllUnderlays(require('../../../fixtures/paths/entry/package.json'), pwd);

        assert.isFalse(overlays.isUnderlay('base', 'cartridgeC', paths));
    });

    it('Should return false if one of the cartridges is not in the list', () => {
        const pwd = path.resolve(__dirname, '../../../fixtures/paths/entry');
        const paths = overlays.getAllUnderlays(require('../../../fixtures/paths/entry/package.json'), pwd);

        assert.isFalse(overlays.isUnderlay('foo', 'bar', paths));
    });
});
