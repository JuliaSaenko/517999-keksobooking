'use strict';
(function () {

  var GuestsInRoom = {
    ROOM_1: ['1'],
    ROOM_2: ['1', '2'],
    ROOM_3: ['1', '2', '3'],
    ROOM_100: ['0']
  };

  var PrisePerPlase = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var adForm = document.querySelector('.ad-form');

  var adFormRoomFieldset = adForm.querySelector('#room_number');
  var adFormCapasityFieldset = adForm.querySelector('#capacity');
  var adFormPriceFieldset = adForm.querySelector('#price');
  var adFormTypeFieldset = adForm.querySelector('#type');
  var adFormCheckInFieldset = adForm.querySelector('#timein');
  var adFormCheckOutFieldset = adForm.querySelector('#timeout');

  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormAddressFieldset = adForm.querySelector('#address');

  var disabledForm = function () {
    adForm.classList.add('ad-form--disabled');
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = true;
    }
  };

  var enabledForm = function () {
    adForm.classList.remove('ad-form--disabled');
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = false;
    }
  };

  var setAddressCoords = function (coords) {
    adFormAddressFieldset.value = coords.x + ', ' + coords.y;
  };

  var roomChangingFieldset = function () {
    var guests = GuestsInRoom['ROOM_' + adFormRoomFieldset.value];
    var isMatch = guests.includes(adFormCapasityFieldset.value);
    if (isMatch) {
      adFormCapasityFieldset.setCustomValidity('');
    } else {
      adFormCapasityFieldset.setCustomValidity('"Это вам не подходит"');
    }
  };

  adFormRoomFieldset.addEventListener('change', roomChangingFieldset);
  adFormCapasityFieldset.addEventListener('change', roomChangingFieldset);

  adFormTypeFieldset.addEventListener('change', function () {
    var key = adFormTypeFieldset.value.toUpperCase();
    adFormPriceFieldset.min = PrisePerPlase[key];
    adFormPriceFieldset.placeholder = PrisePerPlase[key];
  });
  adFormCheckInFieldset.addEventListener('change', function () {
    var checkTime = adFormCheckInFieldset.value;
    adFormCheckOutFieldset.value = checkTime;
  });
  adFormCheckOutFieldset.addEventListener('change', function () {
    var checkTime = adFormCheckOutFieldset.value;
    adFormCheckInFieldset.value = checkTime;
  });

  window.form = {
    disabledForm: disabledForm,
    enabledForm: enabledForm,
    setAddressCoords: setAddressCoords
  };
})();
