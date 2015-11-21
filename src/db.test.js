'use strict';

var expect = require('chai').expect;
var assert = require('chai').assert;
var _ = require('lodash');
var db = require('./db');

beforeEach(function() {
    db.reset();
    db.newUser();
    db.newUser();
    db.createNetwork(db.agents[0].id);
    db.createContribution(db.agents[1].id);
    console.log(db.agents);
    //console.log(db.networks);
    console.log(db.contributions);
});

describe('db function', function () {
    describe('newUser', function () {
        it('should create a new user', function () {
            var len = db.agents.length;
            expect(db.newUser()).to.be.above(0);
            expect(db.agents.length).to.be.equal(len+1);
            expect(db.agents[0].networks.length).to.be.equal(1);
            expect(db.newUser()).to.be.above(1);
            expect(db.agents.length).to.be.equal(len+2);
            expect(db.agents[0].networks.length).to.be.equal(1);
            //console.log(db.agents);
        });
    });
    describe('createNetwork', function () {
        it('should create a new network', function () {
            expect(db.createNetwork(_.last(db.networks).id++).id).to.be.above(0);
            expect(db.networks.length).to.be.above(0);
        });
        it('should fail if network exists', function () {
            assert.throws(function() {db.createNetwork(db.agents[0].id)});
        });
    });
    describe('createContribution', function () {
        var contribution;
        it('should create a new contribution and update agent contributions array', function () {
            //console.log(db.agents);
            contribution = db.createContribution(db.agents[0].id);
            expect(contribution.id).to.be.above(0);
            expect(db.contributions.length).to.be.above(0);
            expect(_.includes(db.agents[0].contributions, contribution.id)).to.be.true;
            //console.log(db.contributions);
        });
    });
    describe('createEvaluation', function () {
        it('should throw error if contribution does not exists', function () {
            //expect(String(db.createEvaluation(1,3,4))).to.equal('Error: Contribution Does Not Exist');
            assert.throws(function() {db.createEvaluation(1,0,4)});
        });
        it('should create a new evaluation', function () {
            //console.log(db.contributions);
            expect(db.createEvaluation(db.agents[0].id,db.contributions[0].id,1).id).to.be.above(0);
            expect(db.evaluations.length).to.be.above(0);
            //console.log(db.evaluations);
        });
    });
    describe('existingContribution', function () {
        it('should check if this is the first contribution of an agent', function () {
            console.log(db.contributions);
            expect(db.existingContribution(db.agents[1].id)).to.not.be.undefined;
            expect(db.existingContribution(0)).to.be.undefined;
        });
    });
});

//function jsonDB() {
//    return {
//        agents: require('../data/db.json').agents,
//        networks: require('../data/db.json').networks,
//        contributions: require('../data/db.json').contributions,
//        evaluations: require('../data/db.json').evaluations
//    }
//}
