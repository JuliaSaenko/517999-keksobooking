'use strict';
(function () {

  var START_WEIGHT = 'any';

  var filtersForm = document.querySelector('.map__filters');
  var filtersSelect = filtersForm.querySelectorAll('select');
  var filtersFieldsets = filtersForm.querySelectorAll('fieldset');

  var filterType = filtersForm.querySelector('#housing-type').value;
  var filterPrice = filtersForm.querySelector('#housing-price').value;
  var filterRooms = filtersForm.querySelector('#housing-rooms').value;
  var filterGuests = filtersForm.querySelector('#housing-guests').value;
  var filterFeatures = filtersForm.querySelector('#housing-features').querySelectorAll('input[name=features]:checked');

  var getFiltredPins = function (data) {
    var arrayCopy = data.slice();

    var featuresValue = [];
    for (var i = 0; i < filterFeatures.length; i++) {
      featuresValue[i] = filterFeatures[i].value;
    }

    var filtredNotices = arrayCopy.filter(function (notice) {
      var isTrue = true;
      if (filterType !== START_WEIGHT && notice.offer.type !== filterType) {
        isTrue = false;
      }
      if (filterPrice === 'low' && notice.offer.price > 10000) {
        isTrue = false;
      } else if (filterPrice === 'middle' && (notice.offer.price > 50000 || notice.offer.price < 10000)) {
        isTrue = false;
      } else if (filterPrice === 'high' && notice.offer.price < 50000) {
        isTrue = false;
      }
      if (filterRooms !== START_WEIGHT && notice.offer.rooms.toString() !== filterRooms) {
        isTrue = false;
      }
      if (filterGuests !== START_WEIGHT && notice.offer.guests.toString() !== filterGuests) {
        isTrue = false;
      }
      for (i = 0; i < featuresValue.length; i++) {
        if (!isTrue) {
          break;
        }
        isTrue = notice.offer.features.includes(document.querySelector('#filter-' + featuresValue[i]).value);
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
