'use strict';

const proxyquire = require('proxyquire').noCallThru().noPreserveCache();
const assert = require('chai').assert;
const path = require('path');

describe('Should prepare for scss compilation', () => {
    it('Should call webpack with the right configuration', () => {
        const cssCompile = proxyquire('../../../../lib/compile/cssCompile', {
            webpack: config => {
                assert.equal(config.name, 'scss');
                assert.exists(config.resolve);
                assert.equal(Object.keys(config.resolve.alias).length, 5);
                assert.isTrue(config.resolve.alias.base.indexOf('/client/default/scss') > 0);
            }
        });

        const packageFile = require('../../../fixtures/paths/entry/package.json');

        cssCompile(packageFile, path.resolve(__dirname, '../../../fixtures/paths/entry'), () => {});
    });

    it('Should merge resolve objects', () => {
        const jsCompile = proxyquire('../../../../lib/compile/cssCompile', {
            webpack: config => {
                assert.equal(config.name, 'scss');
                assert.exists(config.resolve);
                assert.equal(Object.keys(config.resolve.alias).length, 2);
                assert.exists(config.resolve.alias.bootstrap);
                assert.exists(config.resolve.alias.cartridgeC);
            }
        });

        const packageFile = require('../../../fixtures/paths/cartridgeB/package.json');

        jsCompile(packageFile, path.resolve(__dirname, '../../../fixtures/paths/cartridgeB'), () => {});
    });
});
