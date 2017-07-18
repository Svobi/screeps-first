var utils = require('utils');
var role_base = require('role.base');

var roleClaimer = Object.create(role_base);
Object.assign( roleClaimer, {
    name : utils.roles.claimer,
    action: function () {
        var creep = this.creep;
        this.talk(creep.memory.swarm + ' ' + creep.memory.target);
	    if(creep.room.name == creep.memory.target) {
            var nearestController = creep.room.find(FIND_STRUCTURES, {
                filter: function(s) {  return s.structureType == STRUCTURE_CONTROLLER }
            });
            if(creep.claimController(nearestController[0])<0) {
                creep.moveTo(nearestController[0]);
            }
        } else {
            var route = Game.map.findRoute(creep.room, creep.memory.target);
            if(route.length > 0) {
                creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
            }
        }
	}
});

module.exports = roleClaimer;