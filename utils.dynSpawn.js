/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils.dynSpawn');
 * mod.thing == 'a thing'; // true
 */
var utils = require('utils');
var tasks = require('config.tasks');
module.exports = {
    actualActive: [],
    consoleInfo: '',
    config : {
        builderOnlyWhenNeeded : true
    },
    reserve: 25,
    matrix: [
        {type: utils.roles.lrharv, path: ['WORK', 'CARRY', 'CARRY', 'MOVE'], minPath: ['WORK',  'CARRY', 'MOVE'], cache:false},
        {type: utils.roles.soldier, path: ['ATTACK', 'MOVE'], minPath: ['ATTACK', 'MOVE'], cache:false},
        {type: utils.roles.healer, path: ['WORK', 'CARRY', 'MOVE'], minPath: ['WORK', 'CARRY', 'MOVE', 'MOVE'], cache:false},
        {type: utils.roles.upgrader, path: ['WORK', 'CARRY', 'MOVE'], minPath:['WORK', 'CARRY', 'WORK', 'CARRY', 'MOVE' ], cache:false},
        {type: utils.roles.builder, path: ['CARRY', 'WORK', 'CARRY', 'CARRY', 'WORK', 'MOVE'], minPath: ['WORK', 'CARRY', 'MOVE', 'MOVE'], cache:false},
        {type: utils.roles.transporter, path: ['CARRY', 'CARRY', 'MOVE'], minPath: ['CARRY','MOVE'], cache:false},
        {type: utils.roles.miner, path: ['WORK'], minPath: ['MOVE', 'WORK', 'WORK'], cache:false, maxAddParts: 4},
        {type: utils.roles.harvester, path: ['WORK', 'CARRY', 'MOVE'], minPath: ['WORK', 'CARRY', 'MOVE', 'MOVE'], cache:false},
    ],
    parts : [
		//{type: 'RANGED_ATTACK', price: 150, count: 0, mul: -1, val: RANGE_ATTACK},
		{type: 'TOUGH', price: 10, count: 0, mul: -1, val: TOUGH},
		{type: 'ATTACK', price: 80, count: 0, mul: -1, val: ATTACK},
		{type: 'HEAL', price: 250, count: 0, mul: -1, val: HEAL},
		{type: 'MOVE', price: 50, count: 1, mul: -1, min: 1, val: MOVE},
		{type: 'WORK', price: 100, count: 0, mul: -1, val: WORK},
		{type: 'CARRY', price: 50, count: 0, mul: -1, val: CARRY},
	],
    calcNumberOfCreeps: function ( role ) {
        var max = this.spawn.room.energyCapacityAvailable
        var container = this.getCountContainerWithResource(this.spawn.room);
        var y = ((Math.sqrt(5000-(max*0.001)) / 10.02) - Math.log10((max-280)/150)*1.7);
        var res = 0;
        switch (role) {
            case utils.roles.harvester:
                res = Math.floor(y) - container*1.5;
                break;
            case utils.roles.upgrader:
                var targets = this.spawn.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    res = Math.floor(y/2);
                } else {
                    if (this.getResourcesInContainer(this.spawn.room)) { 
                        res = Math.floor(y/1.2);
                    } else {
                        res = Math.floor(y/2);
                    }
                }
                break;
            case utils.roles.builder:
                if (this.config.builderOnlyWhenNeeded) {
                    var targets = this.spawn.room.find(FIND_CONSTRUCTION_SITES);
                    if(targets.length) {
                        res = Math.floor(y/2);
                    } else res = 0;
                } else {
                    res = Math.floor(y/2);
                }
                break;
            case utils.roles.healer:
                res =1;
                break;
            case utils.roles.soldier:
                res =Math.floor(y/2);
                break;
            case utils.roles.miner:
                res =container;
                break;
            case utils.roles.transporter:
                var add = 0;
                if(this.getResourcesInContainerPerc(this.spawn.room)>30){
                    add = 1;
                }
                res = parseInt(container/2)+add;
                break;
            default:
                res = 0;
                break;
        }
        return res;
    },
	action: function (spawn) {
	    this.spawn = spawn;
        this.consoleInfo=spawn.room.name;
	    var state = this.getResourcesContainer(spawn.room);
        var loop = this.matrix.length;
        var info = '';
        var tryedToSpawn = false;
        
        if (Memory.spawnQue.length>0) {
            var newO = Memory.spawnQue[0];
            if (newO.options.home==this.spawn.room.name) {
                this.consoleInfo+='-Que Spawn ' + Memory.spawnQue.length;
                if (newO!=undefined) {
                    tryedToSpawn = true;
                    var spawnResult = this.doSpawn(newO.role, newO.options);
                    if (typeof spawnResult == 'string') Memory.spawnQue.shift();
                }
            }
        } else {
            while (loop--) {
                var role = this.matrix[loop].type;
                tryedToSpawn = this.checkForRole(tryedToSpawn, role);
                info += '-' + this.matrix[loop].type+':'+this.actualActive[role].count+'/'+this.actualActive[role].shouldHave;
            }
            this.consoleInfo += info + '-Res:' + state.energy + '/' + state.capacity;
        }
        if (!tryedToSpawn) {
            var i = tasks.length;
            while(i--) {
                var t = tasks[i];
                if (spawn.room.name==t.home) {
                    var roleCreeps = _.filter(Game.creeps, (creep) => (
                        creep.memory.role == t.role && 
                        creep.memory.home == t.home && 
                        creep.memory.target == t.target && 
                        creep.memory.swarm == t.name
                        )
                    );
                    if (roleCreeps.length<t.count) {
                        console.log(t.name, t.home, t.target, t.count, roleCreeps.length);
                        tryedToSpawn = true;
                        var options = t.options || {};
                        Object.assign( options , {
                            role: t.role,
                            home: t.home,
                            target: t.target,
                            swarm: t.name
                        });
                        var spawnResult = this.doSpawn(t.role, options);
                    }
                }
            }
        }
        if (this.consoleInfo!='') {
            console.log(this.consoleInfo);
        }
    },
	getPart: function( partTypeName ) {
	    var i = this.parts.length;
	    var res = false;
	    while(i--) {
	        if (this.parts[i].type==partTypeName) return this.parts[i];
	    }
	},
	checkForRole: function ( alreadyTryedToSpawn, role ) {
	    var tryedToSpawn = alreadyTryedToSpawn;
	    var roleCreeps = _.filter(Game.creeps, (creep) => (
            (creep.memory.role == role)&&(creep.memory.target==creep.room.name)&&(creep.memory.target==this.spawn.room.name)
            ));
	    if (this.actualActive[role]==undefined) {
	        this.actualActive[role] = {};
	    }
	    this.actualActive[role].count = roleCreeps.length;
	    var shouldHaveCreepNumber = this.calcNumberOfCreeps( role );
	    this.actualActive[role].shouldHave = shouldHaveCreepNumber;
	    if (!alreadyTryedToSpawn) {
            if(roleCreeps.length < shouldHaveCreepNumber) {
                this.consoleInfo+='-Next:' + role;
                tryedToSpawn = true;
                if (role=='soldier') {
                    this.doSpawn(role, {home: this.spawn.room.name, target: this.spawn.room.name, swarm:'Def'});
                } else {
                    this.doSpawn(role, {home: this.spawn.room.name, target: this.spawn.room.name, swarm:'default'});    
                }
            }
	    }
        return tryedToSpawn;
	},
	doSpawn: function (role, options){
	    if (options==undefined) {
            options = {
                parts: []
            };
        }
        if (options.parts!=undefined && options.parts.length>0) {
            console.log('Use own parts');
            var pattern = { costs: -1, parts: options.parts};
            console.log(pattern.parts);
        } else {
            var pattern = this.buildPartsPattern(role);
        }
        
        options.role = role;
        options.spawning = true;
        options.info={
            costs: pattern.costs
        }
        
        return this.spawn.createCreep(pattern.parts, undefined, options)
    },
    
    buildPartsPattern: function( role, emergency ) {
        var calc = [];
        var loop = this.parts.length;
        while (loop--) {
            calc[this.parts[loop].type] = this.parts[loop].price;
        }

        var max = this.spawn.room.energyCapacityAvailable
        var reserve = Math.round(max/100 * this.reserve);
        var use = max - reserve;
        
        if (use<300) use = 300;
        var usePattern = false;
        var loop = this.matrix.length;
        while (loop--) {
            if (this.matrix[loop].type==role) {
                usePattern = this.matrix[loop];
                loop=0;
            }
        }
        var configParts = [];
        var costs = 0;
        if (usePattern.cache!=undefined&&usePattern.cache&&usePattern.cache.use==use) {
            configParts = usePattern.cache.build;
        } else {
            usePattern.cache = {};
            usePattern.cache.use = use;
            var loop = usePattern.minPath.length;
            while (loop--) {
                var tryPart = this.getPart(usePattern.minPath[loop]);
                if (tryPart.price<=use) {
                    use-=tryPart.price;
                    costs+=tryPart.price;
                    configParts.push(tryPart.val);
                }
            }
            var maxAddParts=99;
            if (usePattern.maxAddParts!=undefined){maxAddParts=usePattern.maxAddParts}
            while( use > 0 && maxAddParts>0) {
                var loop = usePattern.path.length;
                while (loop-- && maxAddParts>0) {
                    var tryPart = this.getPart(usePattern.path[loop]);
                    if (tryPart.price<=use) {
                        use-=tryPart.price;
                        costs+=tryPart.price;
                        configParts.push(tryPart.val);
                        maxAddParts--;
                    } else{
                        use=0;
                    }
                }
            }
            usePattern.cache.build=configParts;
        }
        //console.log('build : '+configParts + ' for ' + role);
        return {parts: configParts, costs: costs};
    },
    getCountContainerWithResource: function (room) {
        var sources = room.find(FIND_STRUCTURES, {
		    filter: function(structure){
		         if (structure.structureType==STRUCTURE_CONTAINER) {
		             var targets = room.find(FIND_SOURCES);
		             var l=targets.length;
		             var hasResNear = false;
		             while (l--) {
	                    if(structure.pos.inRangeTo(targets[l], 1)) {
		                    l=0;
		                    hasResNear = true;
		                }
		             }
		            return hasResNear;
		         }
                return false
            }
		});
		return sources.length;
    },
    getResourcesInContainer: function (room) {
        var state = this.getResourcesContainer(room);
		if (state.energy/state.capacity*100>50) return true;
		return false;
    },
     getResourcesInContainerPerc: function (room) {
        var state = this.getResourcesContainer(room);
		return parseInt(state.energy/state.capacity*100);
    },
    getResourcesContainer: function (room) {
        var sources = room.find(FIND_STRUCTURES, {
		    filter: function(structure){
		         if (structure.structureType==STRUCTURE_CONTAINER) {
		            return true; 
		         } else { 
		             return false;
		         }
                
            }
		});
		var i = sources.length;
		var energy=0;
		var engCap=0;
		while(i--){
		    energy += sources[i].store[RESOURCE_ENERGY];
		    engCap += sources[i].storeCapacity;
		}
		return {energy: energy, capacity: engCap};
    },

};