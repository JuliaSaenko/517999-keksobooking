'use strict';

(function () {

  var SUCCESS_CODE = 200;
  var REQUEST_TIMEOUT = 10000;
  var REPSONSE_TYPE = 'json';
  var DATA_LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var DATA_UPLOAD_URL = 'https://js.dump.academy/keksobooking';

  var createRequest = function (success, error) {
    var request = new XMLHttpRequest();
    request.responseType = REPSONSE_TYPE;

    request.addEventListener('load', function () {
      if (request.status === SUCCESS_CODE) {
        success(request.response);
      } else {
        error('Произошла ошибка: ' + request.status + ' ' + request.statusText);
      }
    });

    request.addEventListener('error', function () {
      error('Ошибка подключения. Проверьте соединение');
    });

    request.addEventListener('timeout', function () {
      error('Сервер отвечает слишком долго. Повторите попытку позже');
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
