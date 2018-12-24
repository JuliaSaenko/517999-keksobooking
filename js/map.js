'use strict';

(function () {

  var TAIL_HEIGHT = 8;
  var MAP_WIDTH = 1200;
  var MAP_HEIGHT = 750;

  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;

  var MAX_PIN_RENDERED = 5;

  var map = document.querySelector('.map');
  var mapPinsList = map.querySelector('.map__pins');
  var mainPin = mapPinsList.querySelector('.map__pin--main');
  var filters = document.querySelector('.map__filters');

  var backendData = [];

  var renderPins = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < Math.min(MAX_PIN_RENDERED, data.length); i++) {
      if (!data[i].offer) {
        continue;
      }
      fragment.appendChild(window.getPin(data[i]));
    }
    mapPinsList.appendChild(fragment);
  };

  var removePins = function () {
    var mapPins = document.querySelectorAll('.map__pin');
    window.card.onCloseBtnPress();
    for (var i = 0; i < mapPins.length; i++) {
      if (!mapPins[i].classList.contains('map__pin--main')) {
        mapPinsList.removeChild(mapPins[i]);
      }
    }
  };

  var onSuccessFiltered = function (data) {
    backendData = data;
    renderPins(backendData);
    filters.addEventListener('change', window.util.debounce(onFilter));
    window.filters.enableFilters();
  };

  var onFilter = function () {
    var filteredData = window.filters.getFiltredPins(backendData);
    removePins();
    renderPins(filteredData);
  };

  var deactivatePage = function () {
    disableMap();
    window.filters.disableFilters();
    window.form.disableForm();
    window.uploadFiles.resetAvatarPhoto();
    window.uploadFiles.resetNoticePhotos();
  };

  var disableMap = function () {
    window.card.onCloseBtnPress();
    map.classList.add('map--faded');
    filters.reset();
    removePins();
    mainPin.style.left = MAP_WIDTH / 2 + 'px';
    mainPin.style.top = MAP_HEIGHT / 2 + 'px';

    mainPin.addEventListener('mouseup', onMainPinMouseDown);
    mainPin.addEventListener('click', activatePage);
  };

  var activatePage = function () {
    enableMap();
    window.form.enableForm();
    mainPin.removeEventListener('click', activatePage);
  };

  var enableMap = function () {
    map.classList.remove('map--faded');
    window.backend.load(onSuccessFiltered, window.getResultMessage.onErrorMessageClick);
  };

  var addressCoords = {};

  var getPinTailCoords = function (pin) {
    var pinX = Math.floor(pin.offsetLeft + pin.clientWidth / 2);
    var pinY = Math.floor(pin.offsetTop + pin.clientHeight + TAIL_HEIGHT);
    return {x: pinX, y: pinY};
  };

  var getPinStartCoords = function () {
    var pinX = MAP_WIDTH / 2;
    var pinY = MAP_HEIGHT / 2;
    return {x: pinX, y: pinY};
  };

  var onMainPinMouseDown = function () {
    addressCoords = getPinStartCoords(mainPin);
    window.form.setAddressCoords(addressCoords);
    mainPin.removeEventListener('mouseup', onMainPinMouseDown);
  };

  mainPin.addEventListener('mousedown', function (downEvt) {
    downEvt.preventDefault();

    var startCoords = {
      x: downEvt.pageX,
      y: downEvt.pageY
    };

    var onPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var Borders = {
        top: LOCATION_Y_MIN - mainPin.clientHeight - TAIL_HEIGHT,
        bottom: LOCATION_Y_MAX - mainPin.clientHeight - TAIL_HEIGHT,
        left: 0,
        right: map.clientWidth - mainPin.clientWidth
      };

      var shift = {
        x: startCoords.x - moveEvt.pageX,
        y: startCoords.y - moveEvt.pageY
      };

      var pinShifted = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      if (pinShifted.x >= Borders.left && pinShifted.x <= Borders.right) {
        mainPin.style.left = pinShifted.x + 'px';
      }

      if (pinShifted.y >= Borders.top && pinShifted.y <= Borders.bottom) {
        mainPin.style.top = pinShifted.y + 'px';
      }

      addressCoords = getPinTailCoords(mainPin);
      window.form.setAddressCoords(addressCoords);

      startCoords = {
        x: moveEvt.pageX,
        y: moveEvt.pageY
      };
    };

    document.addEventListener('mousemove', onPinMouseMove);

    var onPinMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    };

    document.addEventListener('mouseup', onPinMouseUp);
  });

  mainPin.addEventListener('mouseup', onMainPinMouseDown);
  mainPin.addEventListener('click', activatePage);


  window.map = {
    enableMap: enableMap,
    deactivatePage: deactivatePage,
    renderPins: renderPins,
    removePins: removePins
  };
})();
