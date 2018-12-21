'use strict';

(function () {

  var SUCCESS_CODE = 200;
  var REQUEST_TIMEOUT = 10000;
  var REPSONSE_TYPE = 'json';
  var DATA_LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var DATA_UPLOAD_URL = 'https://js.dump.academy/keksobooking';

  var createRequest = function (onSuccess, onError) {
    var request = new XMLHttpRequest();
    request.responseType = REPSONSE_TYPE;

    request.addEventListener('load', function () {
      if (request.status === SUCCESS_CODE) {
        onSuccess(request.response);
      } else {
        onError('Произошла ошибка: ' + request.status + ' ' + request.statusText);
      }
    });

    request.addEventListener('error', function () {
      onError('Ошибка подключения. Проверьте соединение');
    });

    request.addEventListener('timeout', function () {
      onError('Сервер отвечает слишком долго. Повторите попытку позже');
    });

    request.timeout = REQUEST_TIMEOUT;

    return request;
  };

  var load = function (onLoad, onError) {
    var xhr = createRequest(onLoad, onError);
    xhr.open('GET', DATA_LOAD_URL);
    xhr.send();
  };

  var upload = function (data, onLoad, onError) {
    var xhr = createRequest(onLoad, onError);
    xhr.open('POST', DATA_UPLOAD_URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    upload: upload
  };

})();
