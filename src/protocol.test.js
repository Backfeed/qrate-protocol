'use strict';

var expect = require('chai').expect;
var assert = require('chai').assert;
var _ = require('lodash');
var outputFile = require('output-file');
var protocol = require('./protocol');



describe('protocol function', function () {
    describe('newUser', function () {
        it('should create a new user', function () {
            expect(protocol.newUser()).to.be.above(0);
            expect(protocol.db.agents.length).to.be.equal(1);
            expect(protocol.db.agents[0].networks.length).to.be.equal(1);
            expect(protocol.newUser()).to.be.above(1);
            expect(protocol.db.agents.length).to.be.equal(2);
            expect(protocol.db.agents[0].networks.length).to.be.equal(1);
            //console.log(protocol.db.agents);
        });
    });
    describe('createNetwork', function () {
        it('should create a new network', function () {
            //expect(protocol.createNetwork(_.last(db.networks).id++).id).to.be.above(0);
            expect(protocol.createNetwork(1).id).to.be.above(0);
            expect(protocol.db.networks.length).to.be.above(0);
            //console.log(protocol.db.networks);
        });
        it('should fail if network exists', function () {
            //expect(String(protocol.createNetwork(1))).to.equal('Error: Network Already Exists');
            assert.throws(function() {protocol.createNetwork(1)});
        });
    });
    describe('createContribution', function () {
        var contribution;
        var agentId = 1;
        it('should create a new contribution', function () {
            //console.log(protocol.db.agents);
            contribution = protocol.createContribution(agentId);
            expect(contribution.id).to.be.above(0);
            expect(protocol.db.contributions.length).to.be.above(0);
            //console.log(protocol.db.contributions);
        });
        it('should update agent contributions array', function () {
            var agent = protocol.getItemById(protocol.db.agents, agentId);
            expect(_.includes(agent.contributions, contribution.id)).to.be.true;
            //console.log(protocol.db.agents);
            //console.log(agent.contributions);
        });
    });
    describe('createEvaluation', function () {
        it('should throw error if contribution does not exists', function () {
            //expect(String(protocol.createEvaluation(1,3,4))).to.equal('Error: Contribution Does Not Exist');
            assert.throws(function() {protocol.createEvaluation(1,4,4)});
        });
        it('should create a new evaluation', function () {
            //console.log(protocol.db.contributions);
            expect(protocol.createEvaluation(1,5,4).id).to.be.above(0);
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
    describe('contribute', function () {
        xit('should create the first evaluation for the creator agent', function () {
        });
        it('should create a new network for agent given being its first contribution', function () {
            //console.log(protocol.db.contributions);
            //console.log(protocol.db.agents);
            //console.log(protocol.db.networks);
            protocol.contribute(2, 1);
            //console.log(protocol.db.networks);
            expect(protocol.db.networks.length).to.be.equal(2);
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
                //createdDir === path.resolve('../data'); //=> true
                //fs.readFileSync('./data/testOutput.txt').toString(); //=> 'Hi!'
            });
        });
    });
});
