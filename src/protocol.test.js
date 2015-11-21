'use strict';

var expect = require('chai').expect;
var assert = require('chai').assert;
var _ = require('lodash');
var outputFile = require('output-file');
var protocol = require('./protocol');
var db = require('./db');

beforeEach(function() {
    db.reset();
    db.newUser();
    db.newUser();
    db.createNetwork(db.agents[0].id);
    db.createContribution(db.agents[1].id);
    //console.log(db.agents);
    //console.log(db.networks);
});

describe('protocol function', function () {

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
            //console.log(protocol.db.agents);
            protocol.newContribution(8);
            //console.log(protocol.db.agents);
            expect(protocol.newContribution(8)).to.be.above(0);
        });
    });
    xdescribe('newEvaluation', function () {
        it('should append a new evaluation of a given agent to the contribution array', function () {
        });
        it('should distribute reputation to contributor agent if consensus is reached', function () {
        });
    });
    describe('contribute', function () {
        xit('should create the first evaluation for the creator agent', function () {
        });
        it('should not create a new network for agent given its not the first contribution', function () {
            protocol.contribute(db.agents[1].id, 1);
            expect(protocol.db.networks.length).to.be.equal(1);
        });
    });
    describe('reputationEvolution', function () {
        it('should calc the new reputation state by checking alignment with past distribution', function () {
            expect(protocol.reputationEvolution(8,3,4,5,6)).to.be.equal(7.992);
        });
        xit('should return new reputation of 1 if this was the first evaluation', function () {
            expect(protocol.reputationEvolution(0,0,1,0,1)).to.be.equal(1);
        });
    });
    describe('output', function () {
        it('db object to a file', function () {
            outputFile('./data/testOutput.json', JSON.stringify(protocol.db, null, 4), function (err, createdDir) {
                console.log(err);
                if (err) {
                    throw err;
                }
            });
        });
    });
});
