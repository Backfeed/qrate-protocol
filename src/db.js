'use strict';

var _ = require('lodash');
var factory = require('./factory');

var agents = [];
var networks = [];
var contributions = [];
var evaluations = [];

//var mock = require('mockjs');

module.exports = {
    networks: networks,
    agents: agents,
    contributions: contributions,
    evaluations: evaluations,
    newUser: newUser,
    fetchUserReputation: fetchUserReputation,
    createNetwork: createNetwork,
    createContribution: createContribution,
    createEvaluation: createEvaluation,
    existingContribution: existingContribution,
    reset: reset
};

function newUser() {
    var instance = factory.createAgent();
    instance.networks.push(factory.createNetStatsForAgent(0));
    agents.push(instance);
    return instance.id;
}

function fetchUserReputation(agentId, networkId) {
    var agent = _.find(agents, 'id', agentId);
    var netStat = _.find(agent.networks, 'id', networkId);
    return netStat.reputationBalance;
}

function createContribution(agentId) {
    var instance = factory.createContribution(agentId);
    var agent = _.find(agents, 'id', agentId);
    agent.contributions.push(instance.id);
    contributions.push(instance);
    return instance;
}

function createEvaluation(agentId, contributionId, evaluatedValue) {
    var contribution = _.find(contributions, 'id', contributionId);
    if (!contribution) throw new Error('Contribution Does Not Exist');
    var instance = factory.createEvaluation(agentId, contributionId, evaluatedValue);
    evaluations.push(instance);
    return instance;
}

function createNetwork(agentId) {
    var instance = factory.createNetwork(agentId);
    if (_.find(networks, 'agentId', instance.agentId))
    {
        throw new Error('Network Already Exists');
    } else {
        instance.networks.push(factory.createNetStatsForNet(0));
        networks.push(instance);
    }
    return instance;
}

function existingContribution(agentId) {
    // Better search for an empty contribution array on agent object
    return _.find(contributions, 'agentId', agentId);
}

function reset() {
    agents.length = 0;
    networks.length = 0;
    contributions.length = 0;
    evaluations.length = 0;
}
