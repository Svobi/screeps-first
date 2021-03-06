var factory = require('factory');
var utilsGC = require('utils.garbageCollection');
var roleManager = require('role.Mananger');
var utilsDynSpawn = require('utils.dynSpawn');
var buildingTower = require('building.tower');


factory.init();

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

/*
Memory.spawnQue.push({role: 'claimer', options:{target:'W7N9', home:'W5N8', parts:[MOVE, CLAIM]}});
Memory.spawnQue.push({role: 'builder', options:{target:'W7N9', home:'W5N8'}});
Memory.spawnQue.push({role: 'upgrader', options:{target:'W7N9', home:'W5N8'}});
*/