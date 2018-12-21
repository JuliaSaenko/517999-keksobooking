'use strict';
(function () {

  var GuestsInRoom = {
    ROOM_1: ['1'],
    ROOM_2: ['1', '2'],
    ROOM_3: ['1', '2', '3'],
    ROOM_100: ['0']
  };

  var PrisePerPlase = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PLACE: 10000
  };

  var adForm = document.querySelector('.ad-form');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');

  var adFormRoomFieldset = adForm.querySelector('#room_number');
  var adFormCapasityFieldset = adForm.querySelector('#capacity');
  var adFormPriceFieldset = adForm.querySelector('#price');
  var adFormTypeFieldset = adForm.querySelector('#type');
  var adFormCheckInFieldset = adForm.querySelector('#timein');
  var adFormCheckOutFieldset = adForm.querySelector('#timeout');

  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormAddressFieldset = adForm.querySelector('#address');

  var disableForm = function () {
    adForm.classList.add('ad-form--disabled');
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = true;
    }
    adFormPriceFieldset.placeholder = 1000;
    adFormPriceFieldset.min = 1000;

  };

  var enableForm = function () {
    adForm.classList.remove('ad-form--disabled');
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = false;
    }
    adFormSubmit.addEventListener('click', onSubmitClick);
  };

  var onSubmitClick = function (evt) {
    if (!adForm.checkValidity()) {
      adForm.classList.add('ad-form--invalid');
    } else {
      evt.preventDefault();
      adForm.classList.remove('ad-form--invalid');
      window.backend.upload(new FormData(adForm), window.getResultMessage.onSuccessMessageClick, window.getResultMessage.onErrorMessageClick);
    }
  };

  adForm.addEventListener('reset', function () {
    setTimeout(function () {
      window.map.deactivatePage();
    }, 0);
  });

  var setAddressCoords = function (coords) {
    adFormAddressFieldset.value = coords.x + ', ' + coords.y;
  };

  var onChangeRoomFieldset = function () {
    var guests = GuestsInRoom['ROOM_' + adFormRoomFieldset.value];
    var isMatch = guests.includes(adFormCapasityFieldset.value);
    if (isMatch) {
      adFormCapasityFieldset.setCustomValidity('');
    } else {
      adFormCapasityFieldset.setCustomValidity('"Это вам не подходит"');
    }
  };

  adFormRoomFieldset.addEventListener('change', onChangeRoomFieldset);
  adFormCapasityFieldset.addEventListener('change', onChangeRoomFieldset);

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
    disableForm: disableForm,
    enableForm: enableForm,
    setAddressCoords: setAddressCoords
  };
})();
