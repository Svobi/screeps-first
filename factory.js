module.exports = {
	init: function() {
		if(Memory.factoryInit != undefined)
			return;

		Memory.factoryInit = true;
		this.memory();
	},

	memory: function() {
		if(Memory.spawnQue == undefined)
			Memory.spawnQue = [ ];

		if(Memory.sources == undefined)
			Memory.sources = { };

    },
    
    run: function() {
	},
}