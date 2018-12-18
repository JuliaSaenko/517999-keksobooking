'use strict';
(function () {

  var filterData = {};

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

  var filters = document.querySelector('.map__filters');

  var getFilterData = function () {
    var elements = filters.elements;
    var data = {
      features: []
    };

    for (var i = 0; i < elements.length; i++) {
      if (elements[i].className === 'map__filter') {
        data[elements[i].name] = elements[i].value;
      }

      if (elements[i].className === 'map__features') {
        var features = elements[i].elements;
        for (var j = 0; j < features.length; j++) {
          if (features[j].checked) {
            data.features.push(features[j].value);
          }
        }
      }
    }

    data.rate = data.features.length + 4;
    return data;
  };

  var getNoticeRate = function (notice) {
    notice.rate = 0;
    var type = filterData['housing-type'];
    var rooms = filterData['housing-rooms'];
    var guests = filterData['housing-guests'];
    var price = PriceValue[filterData['housing-price']];

    if (type === 'any' ||
         type === notice.offer.type) {
      notice.rate += 1;
    }

    if (rooms === 'any' ||
         rooms === notice.offer.rooms.toString()) {
      notice.rate += 1;
    }

    if (guests === 'any' ||
         guests === notice.offer.guests.toString()) {
      notice.rate += 1;
    }

    filterData.features.forEach(function (element) {
      if (notice.offer.features.indexOf(element) >= 0) {
        notice.rate += 1;
      }
    });

    if (notice.offer.price >= price.min &&
         notice.offer.price <= price.max) {
      notice.rate += 1;
    }
  };

  window.filters = {
    getFilterData: getFilterData,
    getNoticeRate: getNoticeRate
  };

})();
