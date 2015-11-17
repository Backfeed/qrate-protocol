'use strict';

var db = require('./db').connect();
var factory = require('./factory');
var C = require('./constants');
var _ = require('lodash');
var math = require('mathjs');

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
    reputationEvolution: reputationEvolution,

    createNetwork: createNetwork,
    createContribution: createContribution,
    createEvaluation: createEvaluation,
    existingContribution: existingContribution,
    getItemById: getItemById,
    db: db
};

//in qrate only: reputationStake == REPUTATION_FRACTION_STAKE * evaluatorReputation
function evaluate(contributionId, evaluatorId, evaluatedValue, reputationStake){
    newEvaluation(contributionId, evaluatorId, evaluatedValue, reputationStake);
}

function newUser() {
    var instance = factory.createAgent();
    instance.networks.push(factory.createNetStatsForAgent(0));
    db.agents.push(instance);
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
    saveEvaluatorStatsForContribution(evaluatorId, contributionId);
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
function saveEvaluatorStatsForContribution(evaluatorId, contributionId) {
    var contribution = getItemById(db.contributions, contributionId);
    var agent = getItemById(db.agents, evaluatorId);
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
function getLastTotalVotedReputation(participants) {
    //(networkId) = fetch evaluations from evaluation db and sum all reputation voted so far (per network)
}
function reputationEvolution(lastUserReputation, lastTotalVotedReputation, newTotalVotedReputation, lastTotalAlignedReputation, newTotalAlignedReputation) {
    return (1 - REPUTATION_FRACTION_STAKE)*(lastUserReputation) +
        (REPUTATION_FRACTION_STAKE*lastUserReputation*newTotalAlignedReputation*lastTotalVotedReputation)/
        (lastTotalAlignedReputation*newTotalVotedReputation)
}
// should also get networks.networks
function getParticipantsList(currentEvaluations){
    var participants = [];
    var evaluatorsIds = _.pluck(currentEvaluations, "agentId");
    _.each(evaluatorsIds, function(evaluatorId) {
        var agent = getItemById(db.agents, evaluatorId);
        participants.concat(db.agents.networks);
    });
    return participants;
}

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
    //var contributionId = newContribution(agentId);
    var reputationStake = getAgentsReputationById(agentId) * REPUTATION_FRACTION_STAKE;
    //newEvaluation(contributionId, agentId, evaluatedValue, reputationStake);
    // should create a new network for agent given being its first contribution
    if (!existingContribution(agentId)) createNetwork(agentId);
}

function getAgentsReputationById(agentId) {
    return getParticipatingNetwork(agentId ,0).reputationBalance;
}

function getParticipants(agentId, networkId) {
    var agent = getItemById(db.agents, agentId);
    var network = getItemById(agent.networks, networkId);
    return network;
}

function getParticipatingNetwork(agentId, networkId) {
    var agent = getItemById(db.agents, agentId);
    var network = getItemById(agent.networks, networkId);
    return network;
}

function createContribution(agentId) {
    var instance = factory.createContribution(agentId);
    var agent = getItemById(db.agents, agentId);
    agent.contributions.push(instance.id);
    db.contributions.push(instance);
    return instance;
}

function createEvaluation(agentId, contributionId, evaluatedValue) {
    var contribution = getItemById(db.contributions, contributionId);
    if (!contribution) throw new Error('Contribution Does Not Exist');
    var instance = factory.createEvaluation(agentId, contributionId, evaluatedValue);
    db.evaluations.push(instance);
    return instance;
}

function createNetwork(agentId) {
    var instance = factory.createNetwork(agentId);
    if (_.find(db.networks, function(net) { return net.agentId === instance.agentId}))
    {
        throw new Error('Network Already Exists');
    } else {
        instance.networks.push(factory.createNetStatsForNet(0));
        db.networks.push(instance);
    }
    return instance;
}

function existingContribution(agentId) {
    // Better search for an empty contribution array on agent object
    return _.find(db.contributions, function (item) {
        return item.agentId == agentId;
    });
}

