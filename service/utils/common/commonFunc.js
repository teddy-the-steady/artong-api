module.exports.getTotalRows = function (list) {
    if (typeof list !== 'undefined' && list.length > 0) {
        return list[0].TotalRows
    } else {
        return 0
    }
};

module.exports.extractTotalRows = function (list) {
    if (typeof list !== 'undefined' && list.length > 0) {
        for (let i in list) {
            if (list[i].hasOwnProperty('TotalRows')) {
                delete list[i].TotalRows;
            }
        }
        return list
    } else {
        return {}
    }
};