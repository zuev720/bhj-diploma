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
            data: {}
        } = options,
        xhr = new XMLHttpRequest;
    xhr.withCredentials = true;
    xhr.responseType = options.responseType || 'json';
    const formData = new FormData();
    if (options.method === 'GET') {
        options.url += '?';
        for (const [key, value] of Object.entries(options.data)) {
            options.url += `${key}=${value}&`;
        }
        try {
            xhr.open(options.method, options.url.slice(1, -1));
            xhr.send();
        } catch (err) {
            callback(err);
        }
    } else {
        for (const [key, value] of Object.entries(options.data)) {
            formData.append(key, value);
        }
        try {
            xhr.open(options.method, options.url);
            xhr.send(formData);
        } catch (err) {
            callback(err);
        }

    }

    xhr.addEventListener('readystatechange', (e) => {
        e.preventDefault();
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            if (xhr.response.success === true) {
                callback(null, xhr.response);
            } else {
                callback(xhr.err);
            }
        }
    });
};