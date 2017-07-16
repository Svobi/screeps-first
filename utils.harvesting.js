var utils = require('utils');
var utilsHarvesting = {
    containerOrHarvest: function(creep) {
        var containers = creep.room.find(FIND_STRUCTURES, {
                filter: function(structure){
                    return structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store[RESOURCE_ENERGY] > 0
                }
            });
        var container = creep.pos.findClosestByPath(containers);    
        if (container) {
            var c=creep.withdraw(container, RESOURCE_ENERGY);
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: utils.color.container}});
            }
        } else {
            utilsHarvesting.harvest(creep);
        }
    },
    /** @param {Creep} creep **/
    harvest: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var targets = creep.room.find(FIND_SOURCES);
            if(!creep.memory.source||creep.memory.source==-1){
                var checkNodesCount = {c:99999999, id: -1};
                for (var i=0; i<targets.length; i++) {
                    var srs = targets[i];
                    var foundOnThisNode = creep.room.find(FIND_MY_CREEPS, {filter: (s) => s.memory.source == srs.id})
                    if (checkNodesCount.c>foundOnThisNode.length) {
                        checkNodesCount.c = foundOnThisNode.length;
                        checkNodesCount.id=srs.id;
                    }
                }
                creep.memory.source = checkNodesCount.id;
            }
            
            var source = creep.pos.findClosestByPath(FIND_SOURCES,{filter: (s) => s.id == creep.memory.source});
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: utils.color.harvest}});
            } else {
                creep.memory.routing=false;
            }
        }
    }
};

module.exports = utilsHarvesting;