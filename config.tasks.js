var utils = require('utils');
var rules = [];
if (Memory._info!=undefined) {

if (Memory._info.server=='official') {
    var tasks = [
        { name: 'harv-0', home: 'W13S38', target: 'W13S39', role: utils.roles.lrharv, count: 2, options:{sourceIndex: 0} },
    ];
}
if (Memory._info.server=='danger') {
    var tasks = [
            { name: 'Pat', home: 'W1N7', target: 'W2N7', role: utils.roles.soldier, count: 1 },
            { name: 'harv-0', home: 'W1N7', target: 'W2N7', role: utils.roles.lrharv, count: 2, options:{sourceIndex: 0} },
            { name: 'harv-1', home: 'W1N7', target: 'W2N7', role: utils.roles.lrharv, count: 2, options:{sourceIndex: 1} },

            { name: 'sup-1', home: 'W1N7', target: 'W3N7', role: utils.roles.transporter, count: 1 },
            
            { name: 'Pat', home: 'W3N7', target: 'W3N8', role: utils.roles.soldier, count: 1 },
            { name: 'harv-0', home: 'W3N7', target: 'W3N8', role: utils.roles.lrharv, count: 3, options:{sourceIndex: 0} },
            { name: 'harv-1', home: 'W3N7', target: 'W3N8', role: utils.roles.lrharv, count: 3, options:{sourceIndex: 1} },

            { name: 'harv-1', home: 'W3N7', target: 'W3N6', role: utils.roles.lrharv, count: 2, options:{sourceIndex: 1} },

            { name: 'harv-0', home: 'W3N7', target: 'W4N7', role: utils.roles.lrharv, count: 1, options:{sourceIndex: 0} },
    ];
}
}
module.exports = tasks;