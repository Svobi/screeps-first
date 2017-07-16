var factory = require('factory');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHealer = require('role.healer');
var roleSoldier = require('role.soldier');
var roleMiner = require('role.miner');
var utils = require('utils');
var utilsGC = require('utils.garbageCollection');
var utilsDynSpawn = require('utils.dynSpawn');
factory.init();

module.exports.loop = function () {
    factory.run();
    utilsGC.run();
    utilsDynSpawn.run();
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
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
        role.creep = creep;
       
		role.run(creep);
    }
}