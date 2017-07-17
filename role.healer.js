var roleUpgrader = require('role.upgrader')
var utilsHarvesting = require('utils.harvesting');

var role_base = require('role.base');
var roleHealer = Object.create(role_base);
Object.assign( roleHealer, {
    /** @param {Creep} creep **/
        action: function () {
        var creep = this.creep;

        creep.say('Medic');
	    if(creep.memory.healing && creep.carry.energy == 0) {
            creep.memory.healing = false;
            creep.say('🔄 He:harvest');
	    }
	    if(!creep.memory.healing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.healing = true;
	        creep.say('🚧 H:Healing');
	    }

	    if(creep.memory.healing) {
	        var targets = creep.room.find(FIND_STRUCTURES, {filter: function(structure){ return structure.hits < structure.hitsMax }})
            if(targets.length) {
                target = creep.pos.findClosestByRange(targets)
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }else{
                roleUpgrader.run(creep);
            }
	    }
	    else {
	        utilsHarvesting.containerOrHarvest(creep);
	    }
	}
});

module.exports = roleHealer;