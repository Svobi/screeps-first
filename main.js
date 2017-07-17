var factory = require('factory');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHealer = require('role.healer');
var roleSoldier = require('role.soldier');
var roleMiner = require('role.miner');
var utils = require('utils');
var buildingTower = require('building.tower');
var utilsGC = require('utils.garbageCollection');
var utilsDynSpawn = require('utils.dynSpawn');

factory.init();

module.exports.loop = function () {
    factory.run();
    utilsGC.run();
    utilsDynSpawn.run();
   
   for (var spawn in Game.spawns) {
       console.log(spawn);
      // buildingTower.action(spawn);
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