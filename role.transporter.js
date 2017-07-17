var utils = require('utils');
var utilsHarvesting = require('utils.harvesting');

var role_base = require('role.base');
var roleTransporter = Object.create(role_base);
Object.assign( roleTransporter, {
    /** @param {Creep} creep **/
    action: function () {
        var creep = this.creep;
        
	    if(creep.memory.transporting && creep.carry.energy == 0) {
            creep.memory.transporting = false;
            creep.say('🔄 T:get');
	    }
	    if(!creep.memory.transporting && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.transporting = true;
	        creep.say('🔄 T:set');
	    }

	    if(creep.memory.transporting) {
	       var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_STORAGE
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
            }
	    }
	    else {
	        utilsHarvesting.container(creep);
	    }
	}
});

module.exports = roleTransporter;