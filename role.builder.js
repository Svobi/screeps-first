var utilsHarvesting = require('utils.harvesting');
var utils = require('utils');

var role_base = require('role.base');
var roleBuilder = Object.create(role_base);
Object.assign( roleBuilder, {
    action: function () {
        var creep = this.creep;
        
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.memory.source = -1;
            creep.say('🔄 B:harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 B:build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: utils.color.build}});
                }
            } else {
                var pause = Game.flags["Pause"];
                creep.moveTo(pause, {visualizePathStyle: {stroke: utils.color.pause}});
            }
        }
        else {
            utilsHarvesting.containerOrHarvest(creep);
        }
    }
});

module.exports = roleBuilder;