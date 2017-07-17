var factory = require('factory');
var roleManager = require('role.Mananger');

var utils = require('utils');
var buildingTower = require('building.tower');
var utilsGC = require('utils.garbageCollection');
var utilsDynSpawn = require('utils.dynSpawn');

factory.init();
// Memory.spawnQue.push({role: 'lrharv', options:{target:'W2N7', home:'W1N7', sourceIndex: 0}});
module.exports.loop = function () {
    factory.run();
    utilsGC.run();
    
    for (var spawn_name in Game.spawns) {
        var spawn = Game.spawns[spawn_name];
        utilsDynSpawn.action(spawn);
        buildingTower.action(spawn);
    }
   
    roleManager.action();

}