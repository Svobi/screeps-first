var utilsHarvesting = require('utils.harvesting');
var utils = require('utils');

var role_base = require('role.base');
var roleBuilder = Object.create(role_base);
Object.assign( roleBuilder, {
    name : utils.roles.builder,
    action: function () {
        var creep = this.creep;

        if(creep.room.name == creep.memory.target) {
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
                    var next = creep.pos.findClosestByPath(targets);
                    if(creep.build(next) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(next, {visualizePathStyle: {stroke: utils.color.build}});
                    }
                } else {
                    var pause = Game.flags["Pause"];
                    creep.moveTo(pause, {visualizePathStyle: {stroke: utils.color.pause}});
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

module.exports = roleBuilder;