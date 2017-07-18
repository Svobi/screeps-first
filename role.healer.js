var utils = require('utils');
var roleUpgrader = require('role.upgrader')
var utilsHarvesting = require('utils.harvesting');

var role_base = require('role.base');
var roleHealer = Object.create(role_base);
Object.assign( roleHealer, {
    name : utils.roles.healer,
    action: function () {
        var creep = this.creep;

        this.talk('Medic');
	    if(creep.memory.healing && creep.carry.energy == 0) {
            creep.memory.healing = false;
            creep.say('🔄 He:harvest');
	    }
	    if(!creep.memory.healing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.healing = true;
	        creep.say('🚧 H:Healing');
	    }
        if(creep.room.name == creep.memory.target) {

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
        } else {
            var route = Game.map.findRoute(creep.room, creep.memory.target);
            if(route.length > 0) {
                creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
            }
        }
	}
});

module.exports = roleHealer;