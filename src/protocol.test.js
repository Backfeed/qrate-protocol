var expect = require('chai').expect;
var protocol = require('./index');
describe('test the module API', function () {
    describe('rate', function () {
        it('distribute stake among evaluators', function () {
            expect(protocol.rate()).to.be.true;
        });
    });
    describe('state', function () {
        it('the rep of first agent', function () {
            expect(protocol.state()).to.equal(16);
        });
    });
});
