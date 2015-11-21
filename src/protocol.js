'use strict';

var db = require('./db');
var factory = require('./factory');
var C = require('./constants');
var _ = require('lodash');
var math = require('mathjs');

module.exports = {
    contribute: contribute,
    evaluate: evaluate,
    fetchUserReputation: fetchUserReputation,
    newContribution: newContribution,
    newEvaluation: newEvaluation,
    escrowFee: escrowFee,
    updateTokenBalance:updateTokenBalance,
    updateReputationBalance:updateReputationBalance,
    reputationEvolution: reputationEvolution,

    db: db
};

//in qrate only: reputationStake == REPUTATION_FRACTION_STAKE * evaluatorReputation
function evaluate(contributionId, evaluatorId, evaluatedValue, reputationStake){
    newEvaluation(contributionId, evaluatorId, evaluatedValue, reputationStake);
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
    // if first evaluation save to last
    saveEvaluatorStatsForContribution(evaluatorId, contributionId);

    var evaluator = _.find(db.agents, 'id', evaluatorId);
    // take the new evaluator networks and find them in all existing evaluations networks.
    _.each(evaluator.networks, function(net) {
        var lastUserReputation = net.reputationBalance;//(networkId, evaluatorId) = fetch from userDb
        var lastTotalVotedReputation = 0;// sum of all reputation voted so far (per network)
        var newTotalVotedReputation = net.reputationBalance;// = same as above but including current voting reputation as well
        var lastTotalAlignedReputation = 0;// =  sum of all reputations that voted the same as user, so far (per network)
        var newTotalAlignedReputation = net.reputationBalance;// = the same as above but including current voting reputation as well
        _.each(evaluations, function(evaluation) {
            var agent = _.find(db.agents, 'id', evaluation.agentId);
            var netStat = _.find(agent.networks, 'id', net.id);
            if (netStat) {
                lastTotalVotedReputation += netStat.reputationBalance;
                if (evaluation.evaluatedValue === evaluatedValue) {
                    lastTotalAlignedReputation += netStat.reputationBalance;
                }
            }
        });
        newTotalVotedReputation += lastTotalVotedReputation;
        newTotalAlignedReputation += lastTotalAlignedReputation;
        // newUserReputation
        net.reputationBalance = reputationEvolution(lastUserReputation, lastTotalVotedReputation, newTotalVotedReputation, lastTotalAlignedReputation, newTotalAlignedReputation);
    });

    var delta = 0; //calc with reputationStake
    var fee = 0; //calc
    //updateTokenBalance(evaluators, delta);
    updateReputationBalance(evaluators, fee);
}
function saveEvaluatorStatsForContribution(evaluatorId, contributionId) {
    var contribution = _.find(db.contributions, 'id', contributionId);
    var agent = _.find(db.agents, 'id', evaluatorId);
    _.each(agent.networks, function(net) {
        var netStats = _.find(contribution.networks, 'id', net.id) || factory.createNetStatsForContribution(net.id);
        netStats.totalVotedRep += net.reputationBalance;
        netStats.votes.push(evaluatedValue);
        netStats.perVote[evaluatedValue] += 1;
        netStats.weightedMedian = math.median(netStats.votes);
        netStats.weightedAverage = math.sum(netStats.votes)/netStats.votes.length;
        netStats.tokensPaid = 0;
    })
}
function reputationEvolution(lastUserReputation, lastTotalVotedReputation, newTotalVotedReputation, lastTotalAlignedReputation, newTotalAlignedReputation) {
    return (1 - REPUTATION_FRACTION_STAKE)*(lastUserReputation) +
        (REPUTATION_FRACTION_STAKE*lastUserReputation*newTotalAlignedReputation*lastTotalVotedReputation)/
        (lastTotalAlignedReputation*newTotalVotedReputation)
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
    if (!db.existingContribution(agentId)) db.createNetwork(agentId);
}

function getAgentsReputationById(agentId) {
    return getParticipatingNetwork(agentId ,0).reputationBalance;
}

function getParticipants(agentId, networkId) {
    var agent = _.find(db.agents, 'id', agentId);
    var network = _.find(agent.networks, 'id', networkId);
    return network;
}

function getParticipatingNetwork(agentId, networkId) {
    var agent = _.find(db.agents, 'id', agentId);
    return _.find(agent.networks, 'id', networkId);
}
