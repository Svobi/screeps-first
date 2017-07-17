/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils.dynSpawn');
 * mod.thing == 'a thing'; // true
 */
var utils = require('utils');
module.exports = {
    actualActive: [],
    config : {
        builderOnlyWhenNeeded : true
    },
    reserve: 20,
    matrix: [
        {type: utils.roles.soldier, path: ['ATTACK', 'MOVE'], minPath: ['ATTACK', 'MOVE'], cache:false},
        {type: utils.roles.miner, path: ['WORK'], minPath: ['MOVE', 'WORK'], cache:false},
        {type: utils.roles.healer, path: ['WORK', 'CARRY', 'MOVE'], minPath: ['WORK', 'CARRY', 'MOVE', 'MOVE'], cache:false},
        {type: utils.roles.upgrader, path: ['WORK', 'CARRY', 'MOVE'], minPath:['WORK', 'CARRY', 'MOVE', 'MOVE'], cache:false},
        {type: utils.roles.builder, path: ['WORK', 'CARRY', 'MOVE'], minPath: ['WORK', 'CARRY', 'MOVE', 'MOVE'], cache:false},
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
	getPart: function( partTypeName ) {
	    var i = this.parts.length;
	    var res = false;
	    while(i--) {
	        if (this.parts[i].type==partTypeName) return this.parts[i];
	    }
	},
	run: function () {
	    var Spawn = this.getSpawn();
        var loop = this.matrix.length;
        var info = '';
        var tryedToSpawn = false;
        while (loop--) {
            var role = this.matrix[loop].type;
            tryedToSpawn = this.checkForRole(Spawn, tryedToSpawn, role);
            info += ' ' + this.matrix[loop].type+':'+this.actualActive[role].count+'/'+this.actualActive[role].shouldHave+'|';
        }
        console.log(info);
        
	},
	checkForRole: function ( Spawn, alreadyTryedToSpawn, role ) {
	    var tryedToSpawn = alreadyTryedToSpawn;
	    var roleCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
	    if (this.actualActive[role]==undefined) {
	        this.actualActive[role] = {};
	    }
	    this.actualActive[role].count = roleCreeps.length;
	    var shouldHaveCreepNumber = this.calcNumberOfCreeps( Spawn, role );
	    this.actualActive[role].shouldHave = shouldHaveCreepNumber;
	    if (!alreadyTryedToSpawn) {
            if(roleCreeps.length < shouldHaveCreepNumber) {
                console.log('Next will be ' + role);
                tryedToSpawn = true;
                if (role=='soldier') {
                    this.doSpawn(Spawn, role, {target: Spawn.room.name});
                } else {
                    this.doSpawn(Spawn, role);    
                }
            }
	    }
        return tryedToSpawn;
	},
	doSpawn: function (Spawn, role, options){
	    
        var pattern = this.buildPartsPattern(role);
        if (options==undefined) {
            options = {};
        }
        
        options.role = role;
        Spawn.createCreep(pattern, undefined, options)
    },
    calcNumberOfCreeps: function ( Spawn, role ) {
        var max = Spawn.room.energyCapacityAvailable
        var container = this.getCountContainerWithResource(Spawn.room);
        var y = ((Math.sqrt(5000-(max*0.001)) / 10.02) - Math.log10((max-280)/150)*1.7);
        switch (role) {
            case utils.roles.harvester:
                return Math.floor(y) - container;
                break;
            case utils.roles.upgrader:
                if (this.getResourcesInContainer(Spawn.room)) { 
                    return Math.floor(y/1.2);
                } else {
                    return Math.floor(y/1.6);
                }
                break;
            case utils.roles.builder:
                if (this.config.builderOnlyWhenNeeded) {
                    var targets = Spawn.room.find(FIND_CONSTRUCTION_SITES);
                    if(targets.length) {
                        return Math.floor(y/2);
                    } else return 0;
                }
                break;
            case utils.roles.healer:
                return 1;
                break;
            case utils.roles.soldier:
                return Math.floor(y/2);
                break;
            default:
                return container;
                break;
        }
    },
    buildPartsPattern: function( role, emergency ) {
        var calc = [];
        var loop = this.parts.length;
        while (loop--) {
            calc[this.parts[loop].type] = this.parts[loop].price;
        }
        var Spawn = this.getSpawn();
        var max = Spawn.room.energyCapacityAvailable
        
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
                    configParts.push(tryPart.val);
                }
            }
            while( use > 0 ) {
                console.log(use);
                var loop = usePattern.path.length;
                while (loop--) {
                    var tryPart = this.getPart(usePattern.path[loop]);
                    if (tryPart.price<=use) {
                        use-=tryPart.price;
                        configParts.push(tryPart.val);
                    } else{
                        use=0;
                    }
                }
            }
            usePattern.cache.build=configParts;
        }
        console.log('build : '+configParts + ' for ' + role);
        return configParts;
    },
    getSpawn: function () {
        return Game.spawns.s001;
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
		console.log('Resources ' + energy + '/' + engCap);
		if (energy/engCap*100>50) return true;
		return false;
    },
};