var expect = require('chai').expect;
var protocol = require('./protocol');
var C = require('./constants');
describe('test the protocol functions', function () {
    describe('newContribution', function () {
        it('should create a new network for agent given being its first contribution', function () {
            expect(protocol.distribute(1)).to.be.above(0);
        });
        it('should create the first evaluation for the creator agent', function () {
            expect(protocol.distribute(1)).to.be.above(0);
        });
    });
    describe('newEvaluation', function () {
        it('should append a new evaluation of a given agent to the contribution array', function () {
            expect(protocol.distribute(1)).to.be.above(0);
        });
        it('should distribute reputation to contributor agent if consensus', function () {
            expect(protocol.distribute(1)).to.be.above(0);
        });
    });
    //describe('alength', function () {
    //    it('make sure we have a dataset', function () {
    //        expect(protocol.alength()).to.be.above(0);
    //    });
    //});
    //describe('state', function () {
    //    it('the rep of first agent', function () {
    //        expect(protocol.state()).to.equal(16);
    //    });
    //});
});
