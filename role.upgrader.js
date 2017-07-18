var utils = require('utils');
var utilsHarvesting = require('utils.harvesting');
var role_base = require('role.base');

var roleUpgrader = Object.create(role_base);
Object.assign( roleUpgrader, {
    name : utils.roles.upgrader,
    action: function () {
        var creep = this.creep;

        if(creep.room.name == creep.memory.target) {
            if(creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
                creep.memory.source = -1;
                creep.say('🔄 U:harvest');
            }
            if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                creep.memory.upgrading = true;
                creep.say('⚡ U:upgrade');
            }

            if(creep.memory.upgrading) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
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

module.exports = roleUpgrader;