/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const f = function () {},
        {
            method = 'GET',
            callback = f,
            responseType,
            async = true,
            data = {}
        } = options,
        xhr = new XMLHttpRequest;

    let { url } = options;

    let requestData;
    if (responseType) {
        xhr.responseType = responseType;
    }
    xhr.onload = function() {
        callback(null, xhr.response);
    };
    xhr.onerror = function() {
        const err = new Error( 'Request Error' );
        callback(err, null);
    };

    xhr.withCredentials = true;

    if (method === 'GET') {
        const urlParams = Object.entries(data)
            .map(([ key, value ]) => `${key}=${value}`)
            .join( '&' );
        if ( urlParams ) {
            url += '?' + urlParams;
        }
    }
    else {
        requestData = Object.entries( data )
            .reduce((target, [ key, value ]) => {
                target.append(key, value);
                return target;
            }, new FormData );
    }
    try {
        xhr.open(method, url, async);
        xhr.send(requestData);
    }
    catch (err) {
        callback(err);
    }
};