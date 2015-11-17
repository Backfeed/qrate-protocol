'use strict';

var expect = require('chai').expect;
var assert = require('chai').assert;
var _ = require('lodash');
var factory = require('./factory');

describe('factory function', function () {
    describe('createAgent', function () {
        it('should create an agent', function () {
            expect(factory.createAgent().id).to.be.equal(1);
        });
        it('should create an agent with an empty networks array', function () {
            expect(factory.createAgent().networks.length).to.be.equal(0);
        });
    });
    describe('createNetwork', function () {
        it('should create a network', function () {
            expect(factory.createNetwork(3).id).to.be.above(1);
        });
        it('should fail to create a network when agentId is missing', function () {
            assert.throws(function() {factory.createNetwork()});
        });
        it('should create a network with an empty networks array', function () {
            expect(factory.createNetwork(3).networks.length).to.be.equal(0);
        });
    });
    describe('createContribution', function () {
        it('should create a contribution with the given agentId', function () {
            expect(factory.createContribution(1).agentId).to.be.equal(1);
        });
        it('should fail to create a contribution when agentId is missing', function () {
            assert.throws(function() {factory.createContribution()});
        });
        it('should create a contribution with an empty evaluations array', function () {
            expect(factory.createContribution(1).evaluations.length).to.be.equal(0);
        });
    });
    describe('createEvaluation', function () {
        it('should fail to create a evaluation when agentId is missing', function () {
            assert.throws(function() {factory.createEvaluation()});
        });
        it('should fail to create a evaluation when contributionId is missing', function () {
            assert.throws(function() {factory.createEvaluation(1)});
        });
        it('should fail to create a evaluation when evaluationValue is missing', function () {
            assert.throws(function() {factory.createEvaluation(1,1)});
        });
    });
});
