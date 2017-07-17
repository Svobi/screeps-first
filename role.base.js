module.exports = {
    run: function (creep) {
        this.creep=creep;
        
        if (creep.memory.onCreated==undefined) {
            this.doSpawn();
        }
        
        this.action();
        
        if (creep.ticksToLive<=1) {
            this.doDeSpawn();
        }
    },
    doSpawn: function (){
        this.onSpawn();
        this.creep.memory.spawning = false;
    },
    onSpawn: function (){},
    doDeSpawn: function (){
        this.creep.say('Sensenmann');
        this.onDeSpawn();
    },
    onDeSpawn: function (){},

};