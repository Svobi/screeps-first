var utils = require('utils');

var tasks = [
        { name: 'Pat', home: 'W1N7', target: 'W2N7', role: utils.roles.soldier, count: 1 },
        { name: 'harv-0', home: 'W1N7', target: 'W2N7', role: utils.roles.lrharv, count: 2, options:{sourceIndex: 0} },
        { name: 'harv-1', home: 'W1N7', target: 'W2N7', role: utils.roles.lrharv, count: 2, options:{sourceIndex: 1} },
        
        { name: 'Pat', home: 'W3N7', target: 'W3N8', role: utils.roles.soldier, count: 1 },
        { name: 'harv-0', home: 'W3N7', target: 'W3N8', role: utils.roles.lrharv, count: 3, options:{sourceIndex: 0} },
        { name: 'harv-1', home: 'W3N7', target: 'W3N8', role: utils.roles.lrharv, count: 3, options:{sourceIndex: 1} },

        { name: 'harv-1', home: 'W3N7', target: 'W3N6', role: utils.roles.lrharv, count: 2, options:{sourceIndex: 1} },

        { name: 'harv-0', home: 'W3N7', target: 'W4N7', role: utils.roles.lrharv, count: 1, options:{sourceIndex: 0} },

       
        
    ];
module.exports = tasks;