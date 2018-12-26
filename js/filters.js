'use strict';
(function () {

  var START_WEIGHT = 'any';

  var filtersForm = document.querySelector('.map__filters');
  var filtersSelect = filtersForm.querySelectorAll('select');
  var filtersFieldsets = filtersForm.querySelectorAll('fieldset');

  var filterType = filtersForm.querySelector('#housing-type');
  var filterPrice = filtersForm.querySelector('#housing-price');
  var filterRooms = filtersForm.querySelector('#housing-rooms');
  var filterGuests = filtersForm.querySelector('#housing-guests');
  var filterFeatures = filtersForm.querySelector('#housing-features').querySelectorAll('input[name=features');

  var getFiltredPins = function (data) {
    var arrayCopy = data.slice();

    var typeValue = filterType.value;
    var priceValue = filterPrice.value;
    var roomsValue = filterRooms.value;
    var guestsValue = filterGuests.value;

    var checkedFeatures = [];
    for (var i = 0; i < filterFeatures.length; i++) {
      if (filterFeatures[i].checked) {
        checkedFeatures.push(filterFeatures[i].value);
      }
    }

    var filtredNotices = arrayCopy.filter(function (notice) {
      var isTrue = true;
      if (typeValue !== START_WEIGHT && notice.offer.type !== typeValue) {
        isTrue = false;
      }
      if (priceValue === 'low' && notice.offer.price > 10000) {
        isTrue = false;
      } else if (priceValue === 'middle' && (notice.offer.price > 50000 || notice.offer.price < 10000)) {
        isTrue = false;
      } else if (priceValue === 'high' && notice.offer.price < 50000) {
        isTrue = false;
      }
      if (roomsValue !== START_WEIGHT && notice.offer.rooms.toString() !== roomsValue) {
        isTrue = false;
      }
      if (guestsValue !== START_WEIGHT && notice.offer.guests.toString() !== guestsValue) {
        isTrue = false;
      }
      for (i = 0; i < checkedFeatures.length; i++) {
        if (!isTrue) {
          break;
        }
        isTrue = notice.offer.features.includes(document.querySelector('#filter-' + checkedFeatures[i]).value);
      }
      return isTrue;
    });
    return filtredNotices;
  };


  var disableFilters = function () {
    for (var i = 0; i < filtersSelect.length; i++) {
      filtersSelect[i].disabled = true;
    }
    for (var j = 0; j < filtersFieldsets.length; j++) {
      filtersFieldsets[j].disabled = true;
    }
  };

  var enableFilters = function () {
    for (var i = 0; i < filtersSelect.length; i++) {
      filtersSelect[i].disabled = false;
    }
    for (var j = 0; j < filtersFieldsets.length; j++) {
      filtersFieldsets[j].disabled = false;
    }
  };

  window.filters = {
    getFiltredPins: getFiltredPins,
    enableFilters: enableFilters,
    disableFilters: disableFilters
  };
})();
