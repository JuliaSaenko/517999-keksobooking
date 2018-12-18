'use strict';
(function () {

  var MAX_PIN_RENDERED = 5;

  var PriceValue = {
    low: {
      min: 0,
      max: 10000
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000,
      max: Infinity
    }
  };

  var PriceMinMax = {
    MIN: 10000,
    MAX: 50000
  };

  var filterValues = {
    type: '',
    price: '',
    rooms: '',
    guest: '',
    featuresList: []
  };

  var filtersContainer = document.querySelector('.map__filters-container');
  var filters = filtersContainer.querySelector('.map__filters');
  var selectElements = filters.querySelectorAll('select');
  var priceFieldset = filters.querySelector('#housing-price');
  var roomsFieldset = filters.querySelector('#housing-rooms');
  var guestsFieldset = filters.querySelector('#housing-guests');
  var featuresFieldset = filters.querySelector('#housing-features');

  var getFilterChange = function (arg) {
    var node = document.querySelector('#housing-' + arg);
    node.addEventListener('change', function () {
      if (node.value === 'any') {
        filterValues[arg + ''] = true;
      } else {
        filterValues[arg + ''] = node.value;
      }

      window.util.debounce(getFiltredPins);
    });
  };

  getFilterChange('type');
  getFilterChange('price');
  getFilterChange('rooms');
  getFilterChange('guests');


  var filterByValue = function (filteredArray, key, value) {
    return filteredArray.filter(function (filterableItem) {
      return filterableItem.offer[key].toString() === value;
    });
  };

  var filterByPrice = function (filteredArray, value) {
    return filteredArray.filter(function (filterableItem) {
      var price = +filterableItem.offer.price;
      PriceValue = 'any';
      if (price >= PriceMinMax.MIN && price <= PriceMinMax.MAX) {
        PriceValue = 'middle';
      } else if (price > PriceMinMax.MAX) {
        PriceValue = 'high';
      } else {
        PriceValue = 'low';
      }
      return PriceValue === value;
    });
  };

  var filterByFeatures = function (filteredArray) {
    var checkedFeatures = filters.querySelectorAll('#housing-features [type="checkbox"]:checked');
    var filteredByFeaturesArray = filteredArray;
    [].forEach.call(checkedFeatures, function (eachElem) {
      filteredByFeaturesArray = filteredByFeaturesArray.filter(function (item) {
        return item.offer.features.indexOf(eachElem.value) >= 0;
      });
    });
    return filteredByFeaturesArray;
  };

  var getFiltredPins = function (array) {
    var arrayCopy = array.slice();

    if (selectElements.value !== 'any') {
      arrayCopy = filterByValue(arrayCopy, 'type', selectElements.value);
    }
    if (priceFieldset.value !== 'any') {
      arrayCopy = filterByPrice(arrayCopy, priceFieldset.value);
    }
    if (roomsFieldset.value !== 'any') {
      arrayCopy = filterByValue(arrayCopy, 'rooms', roomsFieldset.value);
    }
    if (guestsFieldset.value !== 'any') {
      arrayCopy = filterByValue(arrayCopy, 'guests', guestsFieldset.value);
    }
    arrayCopy = filterByFeatures(arrayCopy);

    window.map.removePins();
    window.card.closeAllPopups();

    var elem = someblock.querySelector('.elem');
    var getfragment = getFilteredFragment(elem, arrayCopy);
    elements('.elements').appendChild(getfragment);
  };

  filters.addEventListener('change', getFiltredPins);

  featuresFieldset.addEventListener('change', function (evt) {
    if (evt.target.type === 'checkbox') {
      if (evt.target.checked) {
        filterValues.featuresList.push(evt.target.value);
      } else {
        filterValues.featuresList.splice(filterValues.featuresList.indexOf(evt.target.value), 1);
      }
    }
    window.util.debounce(getFiltredPins);
  });

  var getFilteredFragment = function (pins, fillingAds) {
    var fragment = document.createDocumentFragment();
    var resultLength = fillingAds.length < MAX_PIN_RENDERED ? fillingAds.length : MAX_PIN_RENDERED;

    for (var i = 0; i < resultLength; i++) {
      var pinElementCloned = pins.cloneNode(true);

      var renderedPinElement = window.pin.renderPin(pinElementCloned);
      fragment.appendChild(renderedPinElement);
    }

    return fragment;
  };

  var showFilters = function (isActive) {
    if (isActive) {
      filtersContainer.remove();
    } else {
      filtersContainer.remove();
    }
  };

  window.filters = {
    getFiltredPins: getFiltredPins,
    showFilters: showFilters
  };
})();
