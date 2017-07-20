/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('path.routing');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    routes : [
        {roomName: "W44N72", from: "5836b7568b8b9619519f0393", to:"5969d4fb0cd9240747657ce7",
            use: [ Game.flags["wp2"], Game.flags["wp1"] ]
        }
    ]
};