'use strict';

var agents = require('../data/db.json').agents;
var networks = require('../data/db.json').networks;
var contributions = require('../data/db.json').contributions;
var expect = require('chai').expect;
var protocol = require('./protocol');
var _ = require('lodash');
var C = require('./constants');
describe.only('test the protocol functions', function () {
    var db = protocol.init();
    describe('createNetwork', function () {
        it('should create a new network', function () {
            //expect(protocol.createNetwork(_.last(db.networks).id++).id).to.be.above(0);
            expect(protocol.createNetwork(1).id).to.be.above(0);
            expect(db.networks.length).to.be.above(0);
            console.log(db.networks);
        });
        xit('should fail if network exists', function () {
            //expect(protocol.createNetwork(1)).to.throw(new Error('Network Already Exists'));
            //console.log(db.networks);
        });
    });
    describe('createContribution', function () {
        it('should create a new contribution', function () {
            expect(protocol.createContribution(1).id).to.be.above(0);
            expect(db.contributions.length).to.be.above(0);
            console.log(db.contributions);
        });
    });
    describe('createEvaluation', function () {
        xit('should throw error if contribution does not exists', function () {
            expect(protocol.createEvaluation(1,3,4).id).to.throw(Error);
        });
        it('should create a new evaluation', function () {
            expect(protocol.createEvaluation(1,5,4).id).to.be.above(0);
            expect(db.evaluations.length).to.be.above(0);
            console.log(db.evaluations);
        });
    });
    describe('existingContribution', function () {
        it('should check if this is the first contribution of an agent', function () {
            expect(protocol.existingContribution(1)).to.not.be.undefined;
            expect(protocol.existingContribution(0)).to.be.undefined;
        });
    });
    describe('newUser', function () {
        xit('should throw error if a user exists', function () {
            expect(protocol.newUser()).to.throw(Error);
        });
        it('should create a new user', function () {
            expect(protocol.newUser()).to.be.above(0);
            expect(db.agents.length).to.be.above(0);
            console.log(db.agents);
        });
    });
    xdescribe('newContribution', function () {
        it('should create a new network for agent given being its first contribution', function () {
            //protocol.newContribution(33);
            //console.log(contributions);
            //console.log(networks);
            //expect(protocol.distribute(1)).to.be.above(0);
        });
        it('should create the first evaluation for the creator agent', function () {
            //expect(protocol.distribute(1)).to.be.above(0);
        });
    });
    xdescribe('newEvaluation', function () {
        it('should append a new evaluation of a given agent to the contribution array', function () {
            //expect(protocol.distribute(1)).to.be.above(0);
        });
        it('should distribute reputation to contributor agent if consensus', function () {
            //expect(protocol.distribute(1)).to.be.above(0);
        });
    });
});
