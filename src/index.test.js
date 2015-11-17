'use strict';

var expect = require('chai').expect;
var assert = require('chai').assert;
var _ = require('lodash');
var index = require('./index');

xdescribe('index function', function () {
    describe('contribute', function () {
        it('should submit a new contribution', function () {
            var agentId = 1;
            var networkId = 2; // if a user sends an id then we know it's not the first contribution, but maybe risky to count on that
            expect(index.contribute(agentId, networkId).id).to.be.above(0);
        });
    });
    describe('evaluate', function () {
        it('should submit a new evaluation', function () {
            var agentId = 1;
            var contributionId = 2;
            var vote = 1;
            expect(index.evaluate(agentId, contributionId, vote).id).to.be.above(0);
        });
    });
    describe('fetchUserReputation', function () {
        it('should get the user reputation', function () {
            var agentId = 1;
            var networkId = 2;
            expect(index.fetchUserReputation(agentId, networkId)).to.be.true;
        });
    });
    describe('newUser', function () {
        it('should create an new user', function () {
            expect(index.newUser().id).to.be.above(0);
        });
    });
});
