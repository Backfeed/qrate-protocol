'use strict';

var protocol = require('./protocol');
var db = require('./db');
module.exports = {
    contribute: protocol.submitContribution,
    evaluate: protocol.submitEvaluation,
    fetchUserReputation: protocol.fetchUserReputation,
    newUser: db.newUser
};

/*
why external, couldn't this be done only by creating first contribution by user?
on consensus how to distribute to evaluators?
on consensus how to make evaluation of network?
does last netStatus can be dynamic?
how to handle distribution of tokens?
when creating a new contribution inside what network does the reputation stands? networkId = 0 ?? see contribute and getAgentsReputationById
please be as descriptive as possible in the newEvaluation step
reputationEvolution - should return new reputation of 1 if this was the first evaluation?
when seeding the first user will he be the creator of network 0?
if a user has reputation in a network from 3 different contributions, is the total reputation of that user be summed?kkk

how does the founding contribution look like?
A Backfeed user with 100% rep?
ethereum might also be a part of the founding contribution, as chris is donating ether for the experiment.
We might also decide to open several users, each representing a user that contributed to the resource library, and make distribute the initial tokens and rep between them, according to their balance in #resource-library set by the slack extension
what happens when someone adds tag to existing link from initial dataset? rates a link? endorse a tag?
*/


