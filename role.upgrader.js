var utilsHarvesting = require('utils.harvesting');

var role_base = require('role.base');
var roleUpgrader = Object.create(role_base);
Object.assign( roleUpgrader, {
    /** @param {Creep} creep **/
       action: function () {
        var creep = this.creep;


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
    }
});

module.exports = roleUpgrader;