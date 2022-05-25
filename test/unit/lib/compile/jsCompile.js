'use strict';

const proxyquire = require('proxyquire').noCallThru().noPreserveCache();
const assert = require('chai').assert;
const path = require('path');

describe('Should prepare for js compilation', () => {
    it('Should call webpack with the right configuration', () => {
        const jsCompile = proxyquire('../../../../lib/compile/jsCompile', {
            webpack: config => {
                assert.equal(config.name, 'js');
                assert.exists(config.resolve);
                assert.equal(Object.keys(config.resolve.alias).length, 5);
                assert.isTrue(config.resolve.alias.base.indexOf('/client/default/js') > 0);
            }
        });

        const packageFile = require('../../../fixtures/paths/entry/package.json');

        jsCompile(packageFile, path.resolve(__dirname, '../../../fixtures/paths/entry'), () => {});
    });

    it('Should merge resolve objects', () => {
        const jsCompile = proxyquire('../../../../lib/compile/jsCompile', {
            webpack: config => {
                assert.equal(config.name, 'js');
                assert.exists(config.resolve);
                assert.equal(Object.keys(config.resolve.alias).length, 2);
                assert.exists(config.resolve.alias.jquery);
                assert.exists(config.resolve.alias.cartridgeC);
            }
        });

        const packageFile = require('../../../fixtures/paths/cartridgeB/package.json');

        jsCompile(packageFile, path.resolve(__dirname, '../../../fixtures/paths/cartridgeB'), () => {});
    });
});
