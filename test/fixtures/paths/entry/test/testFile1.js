const assert = require('chai').assert;

describe('a suite', () => {
    it('test a a', () => { assert.equal(true, true); });
    it('test a b', () => { assert.equal(true, true); });
});

describe('b suite', () => {
    it('test b a', () => { assert.equal(true, true); });
    it('test b b', () => { assert.equal(true, true); });
    it('test b c', () => { assert.equal(true, true); });
    it('test b d', () => { assert.equal(true, true); });
});
