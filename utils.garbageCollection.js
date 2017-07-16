var garbageCollection = {

    /** @param {Creep} creep **/
    run: function() {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
        
        // Cleanup dead spawns
        for (var name in Memory.spawns) {
            if (!Game.spawns[name]) {
                delete Memory.spawns[name];
            }
        }
    }
}
module.exports = garbageCollection;
