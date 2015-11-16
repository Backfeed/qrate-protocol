'use strict';

var nextId = (function (initialId) {
    return nextId = initialId || 1;
})(4);

function HolonFactory(initialId) {
    this.nextId = initialId || 1;
}

HolonFactory.prototype.createAgent = function() {
    return {id: nextId++, networks: [], contributions: [], evaluations: [], timestamp: Date.now()}
};

HolonFactory.prototype.createNetwork = function(agentId) {
    if (typeof agentId == 'undefined') throw new Error('Agent Id is Missing');
    return {id: nextId++, agentId: agentId, networks: [], contributions: [], evaluations: [], members: [], timestamp: Date.now()}
};

HolonFactory.prototype.createContribution = function(agentId) {
    if (typeof agentId == 'undefined') throw new Error('Agent Id is Missing');
    return {id: nextId++, agentId: agentId, evaluations: [], networks: [], timestamp: Date.now()}
};

HolonFactory.prototype.createEvaluation = function(agentId, contributionId, evaluatedValue) {
    if (typeof agentId == 'undefined') throw new Error('Agent Id is Missing');
    if (typeof contributionId == 'undefined') throw new Error('Contribution Id is Missing');
    if (typeof evaluatedValue == 'undefined') throw new Error('Evaluation Value is Missing');
    return {id: nextId++, agentId: agentId, contributionId: contributionId, evaluatedValue: evaluatedValue, timestamp: Date.now()}
};

// 'tokensPaid' which is the number of tokens paid to the contributor. Equivalent to the "last maximal weightedMedian"
HolonFactory.prototype.createNetStatsForContribution = function(networkId) {
    if (typeof networkId == 'undefined') throw new Error('Network Id is Missing');
    return {id: networkId, totalVotedRep: 0, votes: [], perVote: [], weightedMedian: 0, weightedAverage: 0, tokensPaid: 0, timestamp: Date.now()}
};

HolonFactory.prototype.createNetStatsForAgent = function(networkId) {
    if (typeof networkId == 'undefined') throw new Error('Network Id is Missing');
    return {id: networkId, tokenBalance: 0, reputationBalance: 0, timestamp: Date.now()}
};

HolonFactory.prototype.createNetStatsForNet = function(networkId) {
    if (typeof networkId == 'undefined') throw new Error('Network Id is Missing');
    return {id: networkId, tokenBalance: 0, reputationBalance: 0, timestamp: Date.now()}
};

var factory = new HolonFactory();

module.exports = {
    createAgent: factory.createAgent,
    createNetwork: factory.createNetwork,
    createContribution: factory.createContribution,
    createEvaluation: factory.createEvaluation,
    createNetStatsForContribution: factory.createNetStatsForContribution,
    createNetStatsForAgent: factory.createNetStatsForAgent,
    createNetStatsForNet: factory.createNetStatsForNet
};
