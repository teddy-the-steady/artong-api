const getTotalRows = function(list: any[]) {
    if (typeof list !== 'undefined' && list.length > 0) {
        return list[0].TotalRows
    } else {
        return 0
    }
};

const extractTotalRows = function(list: any[]) {
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

const hasBOPermission = function(userGroup: Array<string>) {
    const permissionGroups = ['manager'];
    if (userGroup) {
        return permissionGroups.some(r => userGroup.includes(r));
    }
    return false
};

export {
    getTotalRows,
    extractTotalRows,
    hasBOPermission,
};