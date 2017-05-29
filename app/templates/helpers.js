export function $each(list, callback) {
    return list.map(callback).join('');
}

export function $if(condition, callback, elseCallback) {
    if (condition)
        return callback();
    else if (elseCallback)
        return elseCallback();
        
    return '';
}