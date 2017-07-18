var ruleSet = require('config.rules');
module.exports = {
    handle: function (creep) {
        var loop = ruleSet.length;
        while(loop--) {
            var rule = ruleSet[loop];

            var condLoop = rule.conditions.length;
            var startCond = true;
            while(condLoop--){
                startCond = startCond && rule.conditions[condLoop].cb(creep);
            }
            if (startCond) {
                var setLoop = rule.setter.length;
                while(setLoop--){
                    rule.setter[setLoop].cb(creep);
                }
            }

        }
    }
}