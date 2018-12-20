'use strict';
(function () {

  var START_WEIGHT = 'any';
  var MAX_PIN_RENDERED = 5;

  var PriceMinMax = {
    MIN: 10000,
    MAX: 50000
  };

  var backendData = [];

  var mapPinsList = document.querySelector('.map__pins');
  var filtersForm = document.querySelector('.map__filters');
  var filterType = filtersForm.querySelector('#housing-type');
  var filterPrice = filtersForm.querySelector('#housing-price');
  var filterRooms = filtersForm.querySelector('#housing-rooms');
  var filterGuests = filtersForm.querySelector('#housing-guests');
  var filterFeatures = filtersForm.querySelector('#housing-features');
  var filterFeaturesInputs = filterFeatures.querySelectorAll('input');
  var typeOfHousing;
  var price;
  var rooms;
  var guests;
  var features;

  var contains = function (where, what) {
    for (var i = 0; i < what.length; i++) {
      if (where.indexOf(what[i]) === -1) {
        return false;
      }
    }
    return true;
  };

  var renderFilteredPins = function (data) {
    var fragment = document.createDocumentFragment();
    if (data) {
      var takeNumber = data.length > MAX_PIN_RENDERED ? MAX_PIN_RENDERED : data.length;
      for (var i = 0; i < takeNumber; i++) {
        if ('offer' in data[i]) {
          fragment.appendChild(window.getPin(data[i]));
        }
      }
      mapPinsList.appendChild(fragment);
    }
  };

  var getFiltredPins = function () {
    var arrayCopy = backendData.slice();
    var priceWeight;

    if (typeOfHousing && typeOfHousing !== START_WEIGHT) {
      arrayCopy = arrayCopy.filter(function (notice) {
        return notice.offer.type === typeOfHousing;
      });
    }

    if (price && price !== START_WEIGHT) {
      arrayCopy = arrayCopy.filter(function (notice) {
        if (notice.offer.price < PriceMinMax.MIN) {
          priceWeight = 'low';
        } else if (notice.offer.price > PriceMinMax.MAX) {
          priceWeight = 'high';
        } else if (notice.offer.price >= PriceMinMax.MIN && notice.offer.price <= PriceMinMax.MAX) {
          priceWeight = 'middle';
        }
        return priceWeight === price;
      });
    }

    if (rooms && rooms !== START_WEIGHT) {
      arrayCopy = arrayCopy.filter(function (notice) {
        return notice.offer.rooms.toString() === rooms;
      });
    }

    if (guests && guests !== START_WEIGHT) {
      arrayCopy = arrayCopy.filter(function (notice) {
        return notice.offer.guests.toString() === guests;
      });
    }
    if (features) {
      arrayCopy = arrayCopy.filter(function (notice) {
        return contains(notice.offer.features, features);
      });
    }
    renderFilteredPins(arrayCopy);
  };

  var onFilterChange = function () {
    typeOfHousing = filterType.value;
    price = filterPrice.value;
    rooms = filterRooms.value;
    guests = filterGuests.value;
    var selectedFeatures = filterFeatures.querySelectorAll('input:checked');
    var checkboxesFeaturesChecked = [];
    for (var i = 0; i < selectedFeatures.length; i++) {
      checkboxesFeaturesChecked.push(selectedFeatures[i].value);
    }
    features = checkboxesFeaturesChecked.slice();
    window.map.removePins();
    window.card.closePopup();
    getFiltredPins();
  };


  var resetFilters = function () {
    filterType.value = START_WEIGHT;
    filterPrice.value = START_WEIGHT;
    filterRooms.value = START_WEIGHT;
    filterGuests.value = START_WEIGHT;
    for (var i = 0; i < filterFeaturesInputs.length; i++) {
      filterFeaturesInputs[i].checked = false;
    }
    onFilterChange();
  };

  var onSuccess = function (data) {
    backendData = data;
  };

  window.backend.load(onSuccess, window.getResultMessage.onErrorMessageClick);


  window.filters = {
    resetFilters: resetFilters,
    getFiltredPins: getFiltredPins,
    renderFilteredPins: renderFilteredPins
  };
})();
