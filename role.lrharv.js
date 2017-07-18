var utils = require('utils');
var role_base = require('role.base');
var roleLRHarv = Object.create(role_base);

Object.assign( roleLRHarv, {
    name : utils.roles.lrharv,
    action: function() {
        var creep = this.creep;
        this.talk('LRH - '+creep.memory.sourceIndex);
        if (creep.memory.info!=undefined && creep.memory.info.harvested) {
            this.talk(creep.memory.info.harvested);
        }

        if (creep.memory.working==undefined) creep.memory.working = false;
        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // if in home room
            if (creep.room.name == creep.memory.home) {
                // find closest spawn, extension or tower which is not full
                var structure = creep.room.find(FIND_STRUCTURES, {
                    // the second argument for findClosestByPath is an object which takes
                    // a property called filter which can be a function
                    // we use the arrow operator to define it
                    filter: (s) => (
                        (
                            (
                                s.structureType == STRUCTURE_EXTENSION ||
                                s.structureType == STRUCTURE_SPAWN ||
                                s.structureType == STRUCTURE_TOWER 
                            ) && (s.energy < s.energyCapacity)
                        ) || (
                            (s.structureType == STRUCTURE_CONTAINER) && 
                            (s.store[RESOURCE_ENERGY] < s.storeCapacity)
                        )
                        )
                });
                next = creep.pos.findClosestByRange(structure);
                // if we found one
                if (next != undefined) {
                    // try to transfer energy, if it is not in range
                    var total = _.sum(creep.carry);
                    if (creep.transfer(next, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(next);
                    } else {
                        creep.memory.info = creep.memory.info || {};
                        creep.memory.info.harvested = creep.memory.info.harvested || 0;
                        creep.memory.info.harvested += total;
                    }
                }
            }
            // if not in home room...
            else {
                // find exit to home room
                var exit = creep.room.findExitTo(creep.memory.home);
                // and move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // if in target room
            if (creep.room.name == creep.memory.target) {
                // find source
                if (creep.memory.sourceIndex==undefined) creep.memory.sourceIndex = 0;
                if (creep.memory.srsID==undefined) {
                    var source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];
                    creep.memory.srsID = source.id
                } else {
                    var source = Game.getObjectById(creep.memory.srsID);
                }
                
                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(source);
                }
            }
            // if not in target room
            else {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.target);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
    }
});
module.exports = roleLRHarv;