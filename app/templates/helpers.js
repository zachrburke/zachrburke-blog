module.exports.$each = function $each(list, callback) {
    return list.map(callback).join('');
}

module.exports.$if = function $if(condition, callback, elseCallback) {
    if (condition)
        return callback();
    else if (elseCallback)
        return elseCallback();
        
    return '';
}