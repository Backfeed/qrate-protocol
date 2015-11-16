'use strict';

var protocol = require('./protocol');
module.exports = {
    contribute: protocol.submitContribution,
    evaluate: protocol.submitEvaluation,
    fetchUserReputation: protocol.fetchUserReputation,
    newUser: protocol.newUser
};
// why external, couldn't this be done only by creating first contribution by user?
// on consensus distribute to evaluators
// on consensus make evaluation of network
// does last netStatus can be dynamic?
// how to handle distribution if tokens
// when creating a new contribution inside what network does the reputation stands? networkId = 0 ?? see contribute and getAgentsReputationById
