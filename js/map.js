'use strict';

(function () {

  var TAIL_HEIGHT = 8;
  var MAP_WIDTH = 1200;
  var MAP_HEIGHT = 750;

  var LOCATION_Y_MIN = 130; // data
  var LOCATION_Y_MAX = 630; // data


  var map = document.querySelector('.map'); // card, pin
  var mapPinsList = map.querySelector('.map__pins');
  var mainPin = mapPinsList.querySelector('.map__pin--main');

  var adForm = document.querySelector('.ad-form'); // form
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormAddressFieldset = adForm.querySelector('#address');

  var renderPins = function (list) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < list.length; i++) {
      var pins = window.pin(list[i]);
      fragment.appendChild(pins);
    }
    return fragment;
  };

  var notices = window.notices(8);
  var pins = renderPins(notices);

  var enabledMainPage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = false;
    }
  };

  var setAddressCoords = function (coords) {
    adFormAddressFieldset.value = coords.x + ', ' + coords.y;
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
    enabledMainPage();
    addressCoords = getPinStartCoords(mainPin);
    mapPinsList.appendChild(pins);
    setAddressCoords(addressCoords);
    mainPin.removeEventListener('mouseup', onMainPinMouseDown);
  };

  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = true;
  }

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
      setAddressCoords(addressCoords);

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

})();
