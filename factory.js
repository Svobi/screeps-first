module.exports = {
	init: function() {
		if(Memory.factoryInit != undefined)
			return;

		Memory.factoryInit = true;
		this.memory();
	},

	memory: function() {
	    console.log('check');
		if(Memory.spawnQue == undefined)
			Memory.spawnQue = [ ];

		if(Memory.sources == undefined)
			Memory.sources = { };
			
		if(Memory._info == undefined)
		    Memory._info = {};
		if(Memory._info.server == undefined)
		    Memory._info.server = '';

    },
    
    run: function() {
        this.memory();
	},
}