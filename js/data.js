'use strict';

(function () {

  var NOTICE_TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var NOTICE_TYPES = ['palace', 'flat', 'house', 'bungalo'];

  var NOTICE_CHECK_OUT_IN = ['12:00', '13:00', '14:00'];
  var NOTICE_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var NOTICE_PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var PIN_WIDTH = 50;
  var BLOCK_WIDTH = document.querySelector('.map').clientWidth;

  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;

  var createNotice = function (count) {
    var locationX = window.util.getRandomIntegerFromInterval(PIN_WIDTH / 2, BLOCK_WIDTH - PIN_WIDTH / 2);
    var locationY = window.util.getRandomIntegerFromInterval(LOCATION_Y_MIN, LOCATION_Y_MAX);

    var notice = {
      'author': {
        'avatar': 'img/avatars/user' + (count + 1 < 10 ? '0' + (count + 1) : count + 1) + '.png'
      },
      'offer': {
        'title': NOTICE_TITLES[count],
        'address': locationX + ', ' + locationY,
        'price': window.util.getRandomIntegerFromInterval(1000, 1000000),
        'type': window.util.getRandomElementFromArray(NOTICE_TYPES),
        'rooms': window.util.getRandomIntegerFromInterval(1, 5),
        'guests': window.util.getRandomIntegerFromInterval(1, 8),
        'checkin': window.util.getRandomElementFromArray(NOTICE_CHECK_OUT_IN),
        'checkout': window.util.getRandomElementFromArray(NOTICE_CHECK_OUT_IN),
        'features': window.util.getRandomSubarray(NOTICE_FEATURES),
        'description': '',
        'photos': window.util.shuffleArray(NOTICE_PHOTOS),
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    };
    return notice;
  };

  var getNotices = function (count) {
    var notices = [];
    for (var i = 0; i < count; i++) {
      notices.push(createNotice(i));
    }
    return notices;
  };

  window.notices = getNotices;

})();
