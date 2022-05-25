'use strict';

const assert = require('chai').assert;
const locales = require('../../../../lib/utils/locales');
const path = require('path');

describe('locales', () => {
    it('should not find any locales', () => {
        const foundLocales = locales.findAllLocales(path.resolve(__dirname, '../../../fixtures/locales/default'));
        assert.equal(foundLocales.size, 0);
    });

    it('should find all locales but default', () => {
        const foundLocales = locales.findAllLocales(path.resolve(__dirname, '../../../fixtures/paths/base/cartridges/base/cartridge/client'));
        assert.equal(foundLocales.size, 2);
        assert.isFalse(foundLocales.has('default'));
        assert.isTrue(foundLocales.has('fr_FR'));
        assert.isTrue(foundLocales.has('it_IT'));
        assert.isFalse(foundLocales.has('jp_JP'));
    });
});
