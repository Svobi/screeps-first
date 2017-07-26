var utils = require('utils');
var tasks = [];
if (Memory._info!=undefined) {

    if (Memory._info.server=='official') {
         tasks = [
            { name: 'harv-0', home: 'W13S38', target: 'W13S39', role: utils.roles.lrharv, count: 2, options:{sourceIndex: 0} },
        ];
    }
    if (Memory._info.server=='danger') {
         tasks = [
                //W5N8
                { name: 'harv-0', home: 'W5N8', target: 'W6N8', role: utils.roles.lrharv, count: 1, options:{sourceIndex: 0} },
                { name: 'harv-0', home: 'W5N8', target: 'W5N7', role: utils.roles.lrharv, count: 1, options:{sourceIndex: 0} },
                { name: 'harv-0', home: 'W5N8', target: 'W4N8', role: utils.roles.lrharv, count: 1, options:{sourceIndex: 0} },
                { name: 'harv-0', home: 'W5N8', target: 'W5N9', role: utils.roles.lrharv, count: 1, options:{sourceIndex: 0} },
                //W3N7
                { name: 'harv-0', home: 'W3N7', target: 'W3N8', role: utils.roles.lrharv, count: 1, options:{sourceIndex: 0} },
                { name: 'harv-1', home: 'W3N7', target: 'W3N8', role: utils.roles.lrharv, count: 1, options:{sourceIndex: 1} },
                { name: 'harv-0', home: 'W3N7', target: 'W4N7', role: utils.roles.lrharv, count: 1, options:{sourceIndex: 0} },
                { name: 'harv-0', home: 'W3N7', target: 'W3N6', role: utils.roles.lrharv, count: 1, options:{sourceIndex: 0} },
                { name: 'att-0', home: 'W3N7', target: 'W1N8', role: utils.roles.soldier, count: 1},

                
                /*
                { name: 'sold-0', home: 'W5N8', target: 'W3N7', role: utils.roles.soldier, count: 1 },
                { name: 'buil-0', home: 'W5N8', target: 'W3N7', role: utils.roles.builder, count: 1 },
                { name: 'up-0', home: 'W5N8', target: 'W3N7', role: utils.roles.upgrader, count: 1 },
                */
    
            ];
    }
        /*
       { name: 'Pat', home: 'W1N7', target: 'W2N7', role: utils.roles.soldier, count: 1 },
            { name: 'harv-0', home: 'W1N7', target: 'W2N7', role: utils.roles.lrharv, count: 2, options:{sourceIndex: 0} },
            { name: 'harv-1', home: 'W1N7', target: 'W2N7', role: utils.roles.lrharv, count: 2, options:{sourceIndex: 1} },

            { name: 'sup-1', home: 'W1N7', target: 'W3N7', role: utils.roles.transporter, count: 1 },
            
            { name: 'Pat', home: 'W3N7', target: 'W3N8', role: utils.roles.soldier, count: 1 },
            { name: 'harv-0', home: 'W3N7', target: 'W3N8', role: utils.roles.lrharv, count: 3, options:{sourceIndex: 0} },
            { name: 'harv-1', home: 'W3N7', target: 'W3N8', role: utils.roles.lrharv, count: 3, options:{sourceIndex: 1} },

            { name: 'harv-1', home: 'W3N7', target: 'W3N6', role: utils.roles.lrharv, count: 2, options:{sourceIndex: 1} },

            { name: 'harv-0', home: 'W3N7', target: 'W4N7', role: utils.roles.lrharv, count: 1, options:{sourceIndex: 0} },
        */
}
module.exports = tasks;