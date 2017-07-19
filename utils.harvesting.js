var utils = require('utils');
var utilsHarvesting = {
    container: function(creep) {
        
        var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}
            });
        
        if (dropenergy) {
            if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropenergy)
            }
        } else {
            var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: function(structure){
                        return structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store[RESOURCE_ENERGY] == structure.storeCapacity
                    }
            });
            if (containers==undefined||containers.length==0) {
                var containers = creep.room.find(FIND_STRUCTURES, {
                        filter: function(structure){
                            return structure.structureType == STRUCTURE_CONTAINER &&
                                structure.store[RESOURCE_ENERGY] > 0
                        }
                });
            }
            var container = creep.pos.findClosestByPath(containers);    
            if (container) {
                
                var c=creep.withdraw(container, RESOURCE_ENERGY);
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: utils.color.container}});
                }
            }
        }
    },
    containerOrHarvest: function(creep) {
        var containers = creep.room.find(FIND_STRUCTURES, {
                filter: function(s){
                    return (
                        s.structureType == STRUCTURE_CONTAINER &&
                        s.store[RESOURCE_ENERGY] > 0
                        ) || 
                        (s.structureType == STRUCTURE_STORAGE &&
                        s.store[RESOURCE_ENERGY] > 0)
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
            var targets = creep.room.find(FIND_SOURCES, {
                filter: function(structure){
                    return structure.energy > 0
                }
            });
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

            // Check if Full Container next to Resource
            var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: function(structure){
                        return structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store[RESOURCE_ENERGY] == structure.storeCapacity
                    }
            });
            var container = creep.pos.findClosestByPath(containers);
            
            if(container!=undefined && (container.length>0) && container.pos.inRangeTo(source, 1)) {
                    creep.withdraw(container, RESOURCE_ENERGY);
		    } else {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: utils.color.harvest}});
                }
            }
        }
    }
};

module.exports = utilsHarvesting;