module.exports = function(rawData, key){
    "use strict";
    return typeof rawData === 'string' ? new Array(rawData) : rawData;
}
