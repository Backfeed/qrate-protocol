'use strict';

var protocol = require('./protocol');
module.exports = {
    contribute: protocol.submitContribution,
    evaluate: protocol.submitEvaluation,
    fetchUserReputation: protocol.fetchUserReputation,
    newUser: protocol.newUser
};
// why external, couldn't this be done only by creating first contribution by user?
// on consensus how to distribute to evaluators?
// on consensus how to make evaluation of network?
// does last netStatus can be dynamic?
// how to handle distribution of tokens?
// when creating a new contribution inside what network does the reputation stands? networkId = 0 ?? see contribute and getAgentsReputationById
// please be as descriptive as possible in the newEvaluation step
