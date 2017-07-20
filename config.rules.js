var utils = require('utils');
var rules = [];
if (Memory._info!=undefined) {
if (Memory._info.server=='official') {
    var rules = [
    ];
}
if (Memory._info.server=='danger') {
    var rules = [
        { 
            name: 'SendHealer', 
            count: 1,
            conditions:[
                { name: 'ticksToLive', cb: function (creep) {
                    if (creep.memory.role==utils.roles.healer) {
                        return  creep.ticksToLive<300 && 
                            creep.memory.role==utils.roles.healer &&
                            creep.memory.target=='W1N7';
                    }
                    return false;
                } }
            ], 
            setter:[
                {name: 'setTarget', cb: function (creep) {
                    creep.memory.target = 'W2N7';
                }}
            ] 
        },
        { 
            name: 'SendHealer', 
            count: 1,
            conditions:[
                { name: 'ticksToLive', cb: function (creep) {
                    if (creep.memory.role==utils.roles.healer) {
                        return  creep.ticksToLive<300 && 
                            creep.memory.role==utils.roles.healer &&
                            creep.memory.target=='W3N7';
                    }
                    return false;
                } }
            ], 
            setter:[
                {name: 'setTarget', cb: function (creep) {
                    creep.memory.target = 'W2N7';
                }}
            ] 
        }
    ];
}}
module.exports = rules;
