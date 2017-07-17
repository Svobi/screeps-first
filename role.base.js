;module.exports = {
    run: function (creep) {
        this.creep=creep;
        
        if (creep.memory.onCreated==undefined) {
            this.onSpawn();
        }
        
        this.action();
        
        if (creep.ticksToLive<=1) {
            creep.say('Sensenmann');
            this.onDeSpawn();
        }
    },
    onSpawn: function (){},
    onDeSpawn: function (){},

};