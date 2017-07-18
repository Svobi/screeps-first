var rules = require('rules.Manager');
var availableRoles = [
    roleTransporter = require('role.transporter'),
    roleHarvester = require('role.harvester'),
    roleUpgrader = require('role.upgrader'),
    roleBuilder = require('role.builder'),
    roleHealer = require('role.healer'),
    roleSoldier = require('role.soldier'),
    roleMiner = require('role.miner'),
    roleLRHarv = require('role.lrharv'),
    roleClaimer = require('role.claimer')
];

module.exports = {
    action: function () {
        var role = null;
        var roleLoop=0;
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            roleLoop = availableRoles.length;
            while(roleLoop--) {
                if (creep.memory.role == availableRoles[roleLoop].name) {
                    role = availableRoles[roleLoop];
                    roleLoop=0;
                }
            }
            //console.log(name, creep.memory.role, role.name);
            rules.handle(creep);
            role.creep = creep;
    		role.run(creep);
        }
        
    }
};