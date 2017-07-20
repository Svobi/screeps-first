var utils = require('utils');
function buildCount(h, b, u, s) {
    var res = {};
    res[utils.roles.harvester] = h;
    res[utils.roles.builder] = b;
    res[utils.roles.upgrader] = u;
    res[utils.roles.soldier] = s;
    return res;
};
    
module.exports = {
    blocked: false,
    levels: [
        {
            count: buildCount(8, 5, 4, 4),
            workerCount: 6,
            worker: [WORK, CARRY, MOVE, MOVE],
            soldier: [ATTACK, MOVE]
        },
        {
            count: buildCount(5, 4, 3, 6),
            workerCount: 5,
            worker: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
            soldier: [ATTACK, ATTACK, MOVE, MOVE, MOVE]
        },
        {
            count: buildCount(4, 2, 2, 6),
            workerCount: 4,
            worker: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
            soldier: [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE]
        },
        {
            count: buildCount(4, 2, 2, 4),
            workerCount: 4,
            worker: [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
            soldier: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    ],
    buildCount: function(h, b, u, s) {
        var res = {};
        res[utils.roles.harvester] = h;
        res[utils.roles.builder] = b;
        res[utils.roles.upgrader] = u;
        res[utils.roles.soldier] = s;
        return res;
    },    
    run: function() {
        var mySpawn = this.getSpawn();

        if(this.blocked) {
            console.log("Spawner blocked")
            return
        }
        level = this.getLevel(mySpawn);
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var soldiers = _.filter(Game.creeps, (creep) => creep.memory.role == 'soldier');
        
        var extensions = mySpawn.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        var extensionConstructionSites = mySpawn.room.find(FIND_CONSTRUCTION_SITES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        var numExtensions = extensions.length + extensionConstructionSites.length
        
        console.log('H:'+harvesters.length+'/'+level.count[utils.roles.harvester]+'|B:'+builders.length+'/'+level.count[utils.roles.builder]+'|U:'+upgraders.length+'/'+level.count[utils.roles.upgrader]+'|S:'+soldiers.length+'/'+level.count[utils.roles.soldier]);
        if(harvesters.length < level.count[utils.roles.harvester]) {
            mySpawn.createCreep(level.worker, undefined, {role: 'harvester'})
        } else if(builders.length < level.count[utils.roles.builder]) {
            mySpawn.createCreep(level.worker, undefined, {role: 'builder'})
        } else if(upgraders.length < level.count[utils.roles.upgrader]) {
            mySpawn.createCreep(level.worker, undefined, {role: 'upgrader'})
        } else {
            if (soldiers.length < (level.count[utils.roles.soldier])) {
                mySpawn.createCreep(level.soldier, undefined, {role: 'soldier', target: mySpawn.room.name})
            }
        }
    },
    getSpawn: function () {
        return Game.spawns.s001;
    },
    getLevel: function(spawn){
        max = spawn.room.energyCapacityAvailable
        var index = 0;
        if (max <= (300 + 5 * 50)) {
            index = 0;
        } else if (max <= (300 + 8*50)) {
            index = 1;
        } else if (max <= (300 + 13*50)) {
            index = 2;
        } else if (max <= (300 + 20*50)) {
            index = 3;
        } else {
            console.log("Update designs!")
            index = 3;
        }
        console.log('energyCapacityAvailable is '+max+' so we take Level ' + index);
        return this.levels[index];
    }

};
