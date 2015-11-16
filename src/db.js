'use strict';

var agents;
var networks;
var contributions;
var evaluations;

//var mock = require('mockjs');

module.exports = {
    connect: emptyDB
};

function jsonDB() {
    return {
        agents: require('../data/db.json').agents,
        networks: require('../data/db.json').networks,
        contributions: require('../data/db.json').contributions,
        evaluations: require('../data/db.json').evaluations
    }
}

function resetDB() {
    agents = [];
    contributions = [];
    networks = [];
    evaluations = [];
}

function emptyDB() {
    resetDB();
    return {
        networks: networks,
        agents: agents,
        contributions: contributions,
        evaluations: evaluations
    }
}
