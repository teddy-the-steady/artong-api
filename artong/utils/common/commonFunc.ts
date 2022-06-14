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

const hasBOPermission = function(memberGroups?: string[]) {
    const permissionGroups = ['manager'];
    if (memberGroups) {
        return permissionGroups.some(r => memberGroups.includes(r));
    }
    return false
};

const replaceAll = function(str: string, searchStr: string, replaceStr: string) {
    return str.split(searchStr).join(replaceStr);
};

export {
    getTotalRows,
    extractTotalRows,
    hasBOPermission,
    replaceAll,
};