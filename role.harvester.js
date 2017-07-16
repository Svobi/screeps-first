var utils = require('utils');
var utilsHarvesting = require('utils.harvesting');
var routing = require('path.routing');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            creep.memory.source = -1;
            creep.say('🔄 H:harvest');
        }
        if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('🚧 H:unload');
        }

        if(creep.memory.harvesting) {
            utilsHarvesting.harvest(creep);
        } else {
            var vRouting = false;
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER 
                        ) 
                        && structure.energy < structure.energyCapacity;
                }
            });
            
            if (targets[0]!=undefined) {

                if(targets.length > 0) {
                    var next = targets[0];
                    var tres = creep.transfer(next, RESOURCE_ENERGY); 
                    if(tres == ERR_NOT_IN_RANGE) {
                        creep.moveTo(next, {visualizePathStyle: {stroke: utils.color.unload}});
                    }
                }
            } else {
                var container = creep.room.find(FIND_STRUCTURES, {
                    filter: function(structure){
                        return structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                    }
                });
                if (container.length>0) {
                    var tres = creep.transfer(container[0], RESOURCE_ENERGY); 
                    if(tres == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container[0], {visualizePathStyle: {stroke: utils.color.unload}});
                    }
                } else {
                    var pause = Game.flags["Pause"];
                    creep.moveTo(pause, {visualizePathStyle: {stroke: utils.color.unload}});
                }
            }
        }
    }
};

module.exports = roleHarvester;