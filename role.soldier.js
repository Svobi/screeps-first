var utils = require('utils');
var role_base = require('role.base');

var roleSoldier = Object.create(role_base);
Object.assign( roleSoldier, {
    name : utils.roles.soldier,
    action: function () {
        var creep = this.creep;
        this.talk(creep.memory.swarm + ' ' + creep.memory.target);
	    if(creep.room.name == creep.memory.target) {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
            
            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter(s) { s.type!=STRUCTURE_CONTROLLER }
                })
            }
            //if(creep.room.name == 'W1N8' || creep.room.name == 'W2N8') { console.log(target); }
            if(target) {
                result = creep.attack(target)
                //if(creep.room.name == 'W1N8' || creep.room.name == 'W2N8') { console.log(result, ERR_NOT_IN_RANGE); }
                if(result == OK){
                    
                }else if(result == ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                } 
            } else {
                var goToFlag = undefined;
                for (var flag_name in Game.flags) {
                    var flag = Game.flags[flag_name];
                    if (flag.room.name==creep.room.name) {
                        if (flag.color==COLOR_RED) {
                            goToFlag = flag;
                        }
                    }
                }

                if (goToFlag) {
                    creep.moveTo(goToFlag, {visualizePathStyle: {stroke: utils.color.unload}});
                } else {
                    creep.move(_.sample([TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT]))
                }
            }
        } else {
            var route = Game.map.findRoute(creep.room, creep.memory.target)
            if(route.length > 0) {
                creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
            }
        }
	}
});

module.exports = roleSoldier;