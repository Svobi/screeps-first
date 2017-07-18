var utils = require('utils');
var utilsHarvesting = require('utils.harvesting');

var role_base = require('role.base');
var roleHarvester = Object.create(role_base);
Object.assign( roleHarvester, {
    name : utils.roles.harvester,
    action: function () {
        var creep = this.creep;

        
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
                    next = creep.pos.findClosestByRange(targets);
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
                    var next = creep.pos.findClosestByRange(container);
                    var total = _.sum(creep.carry);
                    var tres = creep.transfer(next, RESOURCE_ENERGY); 
                    if(tres == ERR_NOT_IN_RANGE) {
                        creep.moveTo(next, {visualizePathStyle: {stroke: utils.color.unload}});
                    } else {
                        creep.memory.info = creep.memory.info || {};
                        creep.memory.info.harvested = creep.memory.info.harvested || 0;
                        creep.memory.info.harvested += total;
                    }
                } else {
                    var pause = Game.flags["Pause"];
                    creep.moveTo(pause, {visualizePathStyle: {stroke: utils.color.unload}});
                }
            }
        }
    }
});

module.exports = roleHarvester;