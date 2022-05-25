'use strict';
const overlayTester = require('../../../../lib/tests/overlayTester');
const assert = require('chai').assert;
const path = require('path');

describe('overlayTester', () => {
    it('should load all tests', () => {
        const mocha = overlayTester.addAllTests(path.resolve(__dirname, '../../../fixtures/paths/cartridgeA/'), 'test/*.js');
        assert.equal(mocha.files.length, 8);
    });

    it('should load all of the tests and dedupe them', () => {
        let mocha = overlayTester.addAllTests(path.resolve(__dirname, '../../../fixtures/paths/entry/'), 'test/*.js');
        mocha = overlayTester.dedupeTests(mocha);
        assert.equal(mocha.suite.suites.length, 17);
        assert.equal(mocha.suite.suites[0].tests.length, 2);
        assert.equal(mocha.suite.suites[1].tests.length, 4);
        assert.equal(mocha.suite.suites[2].tests.length, 2);
        assert.equal(mocha.suite.suites[3].tests.length, 4);
        assert.equal(mocha.suite.suites[4].tests.length, 2);
        assert.equal(mocha.suite.suites[5].tests.length, 4);
        assert.equal(mocha.suite.suites[6].tests.length, 0);
        assert.equal(mocha.suite.suites[7].tests.length, 0);
        assert.equal(mocha.suite.suites[8].tests.length, 2);
        assert.equal(mocha.suite.suites[9].tests.length, 0);
        assert.equal(mocha.suite.suites[10].tests.length, 0);
        assert.equal(mocha.suite.suites[11].tests.length, 4);
        assert.equal(mocha.suite.suites[12].tests.length, 0);
        assert.equal(mocha.suite.suites[13].tests.length, 0);
        assert.equal(mocha.suite.suites[14].tests.length, 0);
        assert.equal(mocha.suite.suites[15].tests.length, 2);
        assert.equal(mocha.suite.suites[16].tests.length, 4);
    });
});
