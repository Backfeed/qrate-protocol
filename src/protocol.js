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
    var contribution = _.find(db.contributions, 'id', contributionId);
    var evaluator = _.find(db.agents, 'id', evaluatorId);

    db.createEvaluation(evaluatorId, contributionId, evaluatedValue);
    // save agents' history to the current contribution evaluations total, per network
    // if first evaluation save to last
    setEvaluatorStatsForContribution(evaluator, contribution);

    // take the new evaluator networks and find them in all existing evaluations networks.
    _.each(evaluator.networks, function(net) {
        var currentReputation = getCurrentReputationState(contribution.evaluations, evaluatedValue);
        var totalVotedReputationTi = 0;// sum of all reputation voted so far (per network)
        var totalAlignedReputationTi = 0;// =  sum of all reputations that voted the same as user, so far (per network)

        _.forEachRight(contribution.evaluations, function(prevEvaluation) {
            var pastEvaluator = _.find(db.agents, 'id', prevEvaluation.agentId);
            var netStat = _.find(pastEvaluator.networks, 'id', net.id);
            if (netStat) {
                var currentUserReputation = netStat.reputationBalance;
                totalVotedReputationTi += netStat.reputationBalance;
                if (prevEvaluation.evaluatedValue === evaluatedValue) {
                    totalAlignedReputationTi += netStat.reputationBalance;
                }
                // newUserReputation
                netStat.reputationBalance = reputationEvolution(currentUserReputation, totalVotedReputationTi, currentReputation.total, totalAlignedReputationTi, currentReputation.aligned);
            }
        });
    });

    var delta = 0; //calc with reputationStake
    var fee = 0; //calc
    //updateTokenBalance(evaluators, delta);
    updateReputationBalance(evaluators, fee);
}
function getCurrentReputationState(evaluations, newVotedValue) {
    var totalReputationNow = 0;
    var totalAlignedReputationNow = 0;
    _.each(evaluations, function(prevEvaluation) {
        var pastEvaluator = _.find(db.agents, 'id', prevEvaluation.agentId);
        var netStat = _.find(pastEvaluator.networks, 'id', net.id);
        if (netStat) {
            totalReputationNow += netStat.reputationBalance;
            if (prevEvaluation.evaluatedValue === newVotedValue) {
                totalAlignedReputationNow += netStat.reputationBalance;
            }
        }
    });
    return {
        total: totalReputationNow,
        aligned: totalAlignedReputationNow
    }
}
function setEvaluatorStatsForContribution(evaluator, contribution) {
    _.each(evaluator.networks, function(net) {
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
