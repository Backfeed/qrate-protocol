'use strict';

var expect = require('chai').expect;
var protocol = require('./protocol');
var _ = require('lodash');
var C = require('./constants');
describe.only('test the protocol functions', function () {
    describe('createNetwork', function () {
        it('should create a new network', function () {
            //expect(protocol.createNetwork(_.last(db.networks).id++).id).to.be.above(0);
            expect(protocol.createNetwork(1).id).to.be.above(0);
            expect(protocol.db.networks.length).to.be.above(0);
            //console.log(protocol.db.networks);
        });
        it('should fail if network exists', function () {
            expect(String(protocol.createNetwork(1))).to.equal('Error: Network Already Exists');
        });
    });
    describe('createContribution', function () {
        it('should create a new contribution', function () {
            expect(protocol.createContribution(1).id).to.be.above(0);
            expect(protocol.db.contributions.length).to.be.above(0);
            //console.log(protocol.db.contributions);
        });
    });
    describe('createEvaluation', function () {
        xit('should throw error if contribution does not exists', function () {
            //expect(String(protocol.createEvaluation(1,3,4))).to.equal('Error: Contribution Does Not Exists');
            //expect(protocol.createEvaluation(1,4,4)).to.throw(Error);
        });
        it('should create a new evaluation', function () {
            expect(protocol.createEvaluation(1,6,4).id).to.be.above(0);
            expect(protocol.db.evaluations.length).to.be.above(0);
            //console.log(protocol.db.evaluations);
        });
    });
    describe('existingContribution', function () {
        it('should check if this is the first contribution of an agent', function () {
            expect(protocol.existingContribution(1)).to.not.be.undefined;
            expect(protocol.existingContribution(0)).to.be.undefined;
        });
    });
    describe('newUser', function () {
        it('should create a new user', function () {
            expect(protocol.newUser()).to.be.above(0);
            expect(protocol.db.agents.length).to.be.above(0);
            //console.log(protocol.db.agents);
        });
    });
    xdescribe('updateReputationBalance', function () {
        it('should distribute agents reputation in participating networks', function () {
        });
    });
    xdescribe('updateTokenBalance', function () {
        it('should distribute agents tokens in participating networks', function () {
        });
    });
    xdescribe('escrowFee', function () {
        it('should charge escrow fee from contributor', function () {
        });
    });
    xdescribe('newContribution', function () {
       it('should create a new contribution and update reputation balance and escrow fee', function () {
            console.log(protocol.db.agents);
            protocol.newContribution(8);
            console.log(protocol.db.agents);
            expect(protocol.newContribution(8)).to.be.above(0);
        });
    });
    xdescribe('newEvaluation', function () {
        it('should append a new evaluation of a given agent to the contribution array', function () {
        });
        it('should distribute reputation to contributor agent if consensus is reached', function () {
        });
    });
    xdescribe('contribute', function () {
        it('should create a new network for agent given being its first contribution', function () {
        });
        it('should create the first evaluation for the creator agent', function () {
        });
    });
    describe('reputationEvolution', function () {
        it('should calc the new reputation state by checking alignment with past distribution', function () {
            expect(protocol.reputationEvolution(8,3,4,5,6)).to.be.equal(7.992);
        });
    });
});
