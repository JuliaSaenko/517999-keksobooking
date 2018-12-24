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
    PALACE: 10000
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
    adFormFieldsets.forEach(function (field) {
      field.disabled = true;
    });
    adFormPriceFieldset.placeholder = 1000;
    adFormPriceFieldset.min = 1000;

    adFormSubmit.removeEventListener('click', onSubmitClick);
    adFormTypeFieldset.removeEventListener('change', setMinPrice);
    adFormRoomFieldset.removeEventListener('change', onChangeRoomFieldset);
    adFormCapasityFieldset.removeEventListener('change', onChangeRoomFieldset);
    adFormCheckInFieldset.removeEventListener('change', onChangeCheckIn);
    adFormCheckOutFieldset.removeEventListener('change', onChangeCheckOut);
  };

  var enableForm = function () {
    adForm.classList.remove('ad-form--disabled');
    adFormFieldsets.forEach(function (field) {
      field.disabled = false;
    });
    adFormSubmit.addEventListener('click', onSubmitClick);
    adFormTypeFieldset.addEventListener('change', setMinPrice);
    adFormRoomFieldset.addEventListener('change', onChangeRoomFieldset);
    adFormCapasityFieldset.addEventListener('change', onChangeRoomFieldset);
    adFormCheckInFieldset.addEventListener('change', onChangeCheckIn);
    adFormCheckOutFieldset.addEventListener('change', onChangeCheckOut);
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

  var setMinPrice = function () {
    var key = adFormTypeFieldset.value.toUpperCase();
    adFormPriceFieldset.min = PrisePerPlase[key];
    adFormPriceFieldset.placeholder = PrisePerPlase[key];
  };

  var onChangeCheckOut = function () {
    var checkTime = adFormCheckOutFieldset.value;
    adFormCheckInFieldset.value = checkTime;
  };

  var onChangeCheckIn = function () {
    var checkTime = adFormCheckInFieldset.value;
    adFormCheckOutFieldset.value = checkTime;
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

  window.form = {
    disableForm: disableForm,
    enableForm: enableForm,
    setAddressCoords: setAddressCoords
  };
})();
