var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHealer = require('role.healer');
var roleSoldier = require('role.soldier');
var roleMiner = require('role.miner');
var roleTransporter = require('role.transporter');
var roleLRHarv = require('role.lrharv');

module.exports = {
    action: function () {
        var role = null;
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            
            if(creep.memory.role == 'harvester') {
                role = roleHarvester;
            }
            if(creep.memory.role == 'upgrader') {
                role = roleUpgrader;
            }
            if(creep.memory.role == 'builder') {
                role = roleBuilder;
            }
            if(creep.memory.role == 'healer') {
                role = roleHealer;
            }
            if(creep.memory.role == 'soldier') {
                role = roleSoldier;
            }
            if(creep.memory.role == 'miner') {
                role = roleMiner;
            }
            if(creep.memory.role == 'transporter') {
                role = roleTransporter;
            }
            if(creep.memory.role == 'lrharv') {
                role = roleLRHarv;
            }
            //console.log(name, role);
            role.creep = creep;
    		role.run(creep);
        }
        
    }
};