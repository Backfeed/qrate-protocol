'use strict';

var expect = require('chai').expect;
var factory = require('./factory');
var _ = require('lodash');
var C = require('./constants');
describe('test the factory functions', function () {
    describe('createAgent', function () {
        it('should create an agent', function () {
            expect(factory.createAgent().id).to.be.above(1);
        });
        it('should create an agent with an empty networks array', function () {
            expect(factory.createAgent().networks.length).to.be.equal(0);
        });
    });
    describe('createNetwork', function () {
        it('should create a network', function () {
            expect(factory.createNetwork(3).id).to.be.above(1);
        });
        //it('should THROW an ERROR if an agent already created a network', function () {
        //    expect(factory.createNetwork(3)).to.throw(Error);
        //});
        it('should create a network with an empty evaluators array', function () {
            expect(factory.createNetwork(3).evaluators.length).to.be.equal(0);
        });
    });
    describe('createContribution', function () {
        it('should create a contribution with the given agentId', function () {
            expect(factory.createContribution(1).agentId).to.be.equal(1);
        });
        it('should create a contribution with an empty evaluations array', function () {
            expect(factory.createContribution(1).evaluations.length).to.be.equal(0);
        });
        it('should create a contribution with a unique id', function () {
        });
    });
});
