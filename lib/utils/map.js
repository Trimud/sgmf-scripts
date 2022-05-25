'use strict';

module.exports = {
    concat: (map, ...iterables) => {
        for (const iterable of iterables) {
            for (const item of iterable) {
                map.set(...item);
            }
        }
    }
};
