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
    xhr.withCredentials = true;
    // xhr.responseType = 'json';
    const formData = new FormData();
    if (options.method === 'GET') {
        options.url += '?';
        for (const [key, value] of Object.entries(options.data)) {
            options.url += `${key}=${value}&`;
        }
    } else if (options.method === 'POST') {
        for (const [key, value] of Object.entries(options.data)) {
            formData.append(key, value);
        }
    }

    xhr.open(options.method, options.url);
    xhr.send(formData);

    xhr.addEventListener('readystatechange', (e) => {
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            let response = JSON.parse(xhr.response);
            options.callback(null, response);
            // console.log(JSON.parse(xhr.response).user);
        } else {
            options.callback(xhr.status, xhr.response);
        }
    });
};