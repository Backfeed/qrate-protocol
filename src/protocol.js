'use strict';

var agents = require('../data/db.json').agents;
var networks = require('../data/db.json').networks;
var contributions = require('../data/db.json').contributions;
var evaluations = require('../data/db.json').evaluations;

var factory = require('./factory');
var C = require('./constants');
var _ = require('lodash');
var math = require('mathjs');
var mock = require('mockjs');

module.exports = {
    contribute: contribute,
    evaluate: evaluate,
    fetchUserReputation: fetchUserReputation,
    newUser: newUser,
    newContribution: newContribution,
    newEvaluation: newEvaluation,
    escrowFee: escrowFee,
    updateTokenBalance:updateTokenBalance,
    updateReputationBalance:updateReputationBalance,

    createNetwork: createNetwork,
    createContribution: createContribution,
    createEvaluation: createEvaluation,
    existingContribution: existingContribution,
    init: initDB
};

//in qrate only: reputationStake == REPUTATION_FRACTION_STAKE * evaluatorReputation
function evaluate(contributionId, evaluatorId, evaluatedValue, reputationStake){
    newEvaluation(contributionId, evaluatorId, evaluatedValue, reputationStake);
}

function newUser() {
    var instance = factory.createAgent();
    agents.push(instance);
    return instance.id;
}

function newContribution(agentId) {
    var newContribution = createContribution(agentId);
    var participants = getParticipants(agentId, 0);
    updateTokenBalance(participants, -CONTRIBUTION_FEE);
    escrowFee(participants, CONTRIBUTION_FEE);
}

function newEvaluation(contributionId, evaluatorId, evaluatedValue, reputationStake){
    createEvaluation(evaluatorId, contributionId, evaluatedValue);
    // save agents' history to the current contribution evaluations total, per network
    var contribution = getItemById(contributions, contributionId);
    if (contribution.evaluations.length > 0) {
        var agent = getItemById(agents, evaluatorId);
        _.each(agent.networks, function(net) {
            var netStats = getItemById(contribution.networks, net.id) || factory.createNetStatsForContribution(net.id);
            netStats.totalVotedRep += net.reputationBalance;
            netStats.votes.push(evaluatedValue);
            netStats.perVote[evaluatedValue] += 1;
            netStats.weightedMedian = math.median(netStats.votes);
            netStats.weightedAverage = math.sum(netStats.votes)/netStats.votes.length;
            netStats.tokensPaid = 0;
        })
    }

    // this updates a new array and NOT the referenced array. should create an update function or update the original array live.
    var evaluators = getParticipantsList(currentEvaluations);
    //var networkIds = _.uniq(_.pluck(evaluators, "id"), true);

    _.each(evaluators, function(agentBalance) {
        var lastUserReputation = agentBalance.reputationBalance;//(networkId, evaluatorId) = fetch from userDb
        var lastTotalVotedReputation = getLastTotalVotedReputation(evaluators);
        var newTotalVotedReputation = 0;// = same as above but including current voting reputation as well
        var lastTotalAlignedReputation = 0;// = fetch evaluations from evaluation db and sum all reputations that voted the same as user, so far (per network)
        var newTotalAlignedReputation = 0;// = the same as above but including current voting reputation as well
        var newUserReputation = reputationEvolution(lastUserReputation, lastTotalVotedReputation, newTotalVotedReputation, lastTotalAlignedReputation, newTotalAlignedReputation);
    });

    var delta = 0; //calc with reputationStake
    var fee = 0; //calc
    //updateTokenBalance(evaluators, delta);
    updateReputationBalance(evaluators, fee);
}
function getLastTotalVotedReputation(participants) {
    //(networkId) = fetch evaluations from evaluation db and sum all reputation voted so far (per network)
}
function reputationEvolution(lastUserReputation, lastTotalVotedReputation, newTotalVotedReputation, lastTotalAlignedReputation, newTotalAlignedReputation) {
    var result = 0;
        //(1 - REPUTATION_FRACTION_STAKE)*(userReputationThen) +
        //(REPUTATION_FRACTION_STAKE*userReputationThen*totalAlignedReputationNow*totalVotedReputationThen)/
        //(totalAlignedReputationThen*totalVotedReputationNow)
    return result;
}
// should also get networks.networks
function getParticipantsList(currentEvaluations){
    var participants = [];
    var evaluatorsIds = _.pluck(currentEvaluations, "agentId");
    _.each(evaluatorsIds, function(evaluatorId) {
        var agent = getItemById(agents, evaluatorId);
        participants.concat(agents.networks);
    });
    return participants;
}
//function getAgentById(id) {
//    return getItemById(agents, id);
//}
//function getContributionById(id) {
//    return getItemById(contributions, id);
//}
function getItemById(collection, id) {
    return _.find(collection, function(item) {
        return item.id === id;
    })
}
function fetchUserReputation() {

}

function escrowFee(participants, fee) {
    updateTokenBalance(participants, fee);
}

function updateTokenBalance(participants, delta) {
    _.each(participants, function(bal) {
        bal.tokenBalance += delta;
    })
}

function updateReputationBalance(participants, delta) {
    _.each(participants, function(bal) {
        bal.reputationBalance += delta;
    })
}
function contribute(agentId, evaluatedValue) {
    var contributionId = newContribution(agentId);
    var reputationStake = getAgentsReputationById(agentId) * REPUTATION_FRACTION_STAKE;
    newEvaluation(contributionId, agentId, evaluatedValue, reputationStake);
    // should create a new network for agent given being its first contribution
    var prevContribution = existingContribution(agentId);
    if (!prevContribution) {
        //inside what network does the reputation stands?
        createNetwork(agentId, 0);
    }
}

function getAgentsReputationById(agentId) {
    //inside what network does the reputation stands?
    return agents[agentId].networks[0].reputationBalance;
}

function getParticipants(agentId, networkId) {
     return _.find(agents[agentId].networks, function(bal) {
        return bal.id = networkId;
    });
}

function createContribution(agentId) {
    if (typeof agentId == 'undefined') throw new Error('Agent Id is Missing');
    var instance = factory.createContribution(agentId);
    contributions.push(instance);
    return instance;
}

function createEvaluation(agentId, contributionId, evaluatedValue) {
    if (!_.find(contributions, function(con) { return con.id === contributionId })) throw new Error('Contribution Does Not Exist');
    var instance = factory.createEvaluation(agentId, contributionId, evaluatedValue);
    evaluations.push(instance);
    return instance;
}

function createNetwork(agentId) {
    var instance = factory.createNetwork(agentId);
    if (_.find(networks, function(net) { return net.id === instance.id}))
    {
        return new Error('Network Already Exists');
    } else {
        instance.networks.push(factory.createNetStatsForNet(0));
        networks.push(instance);
    }
    return instance;
}

function existingContribution(agentId) {
    // Better search for an empty contribution array on agent object
    return _.find(contributions, function (item) {
        return item.agentId == agentId;
    });
}

function initDB() {
    agents = [];
    contributions = [];
    networks = [];
    evaluations = [];
    return {
        networks: networks,
        agents: agents,
        contributions: contributions,
        evaluations: evaluations
    }
}
