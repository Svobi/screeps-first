var utilsHarvesting = require('utils.harvesting');

var role_base = require('role.base');
var roleMiner = Object.create(role_base);
Object.assign( roleMiner, {
	getOpenSource: function()
	{
		var creep = this.creep;

		var sources = creep.room.find(FIND_STRUCTURES, {
		    filter: function(structure){
		         if (structure.structureType==STRUCTURE_CONTAINER) {
		             var targets = creep.room.find(FIND_SOURCES);
		             var l=targets.length;
		             var hasResNear = false;
		             while (l--) {
	                    if(structure.pos.inRangeTo(targets[l], 1)) {
		                    l=0;
		                     hasResNear = true;
		                }
		             }
		            if (!hasResNear) 
		                return false;
		            
		            if(Memory.sources[structure.id] == undefined || Memory.sources[structure.id].miner == undefined || Memory.sources[structure.id].miner == creep.id)
    					return true;
    				if(Game.getObjectById(Memory.sources[structure.id].miner) == null)
    					return true;
		         }
                return false
            }
		});
        source = creep.pos.findClosestByPath(sources);
		return source;
	},
	setSourceToMine: function(source) {
		var creep = this.creep;
		if(!source)
			return;

		if(Memory.sources[source.id] == undefined)
			Memory.sources[source.id] = { id: source.id };
        
		Memory.sources[source.id].miner = creep.id;
		creep.memory.source = source.id;
/*
		var helperSpawn = source.pos.findNearest(Game.MY_SPAWNS);
		var steps = helperSpawn.pos.findPathTo(source).length * 2;
		var creepsNeeded = Math.round((steps * 8) / 100);

		if(creepsNeeded > 5)
			creepsNeeded = 5;

		for(var i = 0; i < creepsNeeded; i++)
			Memory.spawnQue.unshift({ type: 'miner_helper', memory: {
				miner: creep.id
			}});

		creep.memory.helpersNeeded = creepsNeeded;
*/
	},

	onSpawn: function() {
		var creep = this.creep;
		creep.memory.isNearSource = false;
		creep.memory.helpers = [];
		var source = this.getOpenSource();
		this.setSourceToMine(source);
		creep.memory.onCreated = true;
	},
	onDeSpawn: function() {
	    Memory.sources[creep.memory.source.id].miner = -1;
		creep.memory.source = source.id;
	},

	action: function () {
        var creep = this.creep;
		var source = Game.getObjectById(creep.memory.source);
        
		if(source == null) {
			var source = this.getOpenSource();

			if(!source)
				return;

			this.setSourceToMine(source);
		}

		if(creep.pos.inRangeTo(source, 0))
			creep.memory.isNearSource = true;
		else
			creep.memory.isNearSource = false;

		if(Memory.sources[source.id] == undefined)
			Memory.sources[source.id] = { id: source.id };

		Memory.sources[source.id].miner = creep.id;

        if (!creep.memory.isNearSource) {
		    creep.moveTo(source);
        } else {
            var resource = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(resource) == ERR_NOT_IN_RANGE) {creep.say('Resource ?!');}
            
        }
	}
});

module.exports = roleMiner;