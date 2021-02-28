/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const f = function () {},
        {
            url = '',
            method = '',
            callback = f,
            responseType,
            async = true,
            data = {}
        } = options,
        xhr = new XMLHttpRequest;
    xhr.withCredentials = true;
    xhr.responseType = responseType || 'json';
    const formData = new FormData();
    if (method === 'GET') {
        options.url += '?';
        for (let element in data) {
            options.url += `${element}=${data[element]}&`
        }
        try {
            xhr.open(method, options.url.slice(1, -1));
            xhr.send();
        } catch (err) {
            callback(err);
        }
    } else {
        for (let element in data) {
            formData.append(element, data[element])
        }
        try {
            xhr.open(method, options.url);
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