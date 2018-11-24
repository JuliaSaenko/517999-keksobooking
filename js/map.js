'use strict';

var NOTICE_TITLES = [ // Можно ли так делать запись(не в одну строку)? Если да, то всегда ли нужнобудет так потом писать, или можно только там, где мне так удобнее?
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var NOTICE_TYPES = ['flat', 'house', 'bungalo'];
var NOTICE_CHECK_OUT_IN = ['12:00', '13:00', '14:00'];
var NOTICE_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var NOTICE_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var getRandomIntegerFromInterval = function (min, max) { // Тоже вопрос про сокращение
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomElementFromArray = function (array) { // МОжно ли сократить как-то(напр. getRandomElement/ getRandomFrom)?
  return array[getRandomIntegerFromInterval(0, array.length - 1)];
};

var locationX = getRandomIntegerFromInterval(300, 900);
var locationY = getRandomIntegerFromInterval(100, 500);

//  Я нашла такой вариант чтобы значения не повторялись. Но не поняла как он работает
//  var getRandomFromOnce = function (array) {
//  var arrayCopy = array.slice();
//  var rest = [];
//  return function () {
//    rest = rest.length > 0 ? rest : rest.concat(arrayCopy);
//    return rest.splice(getRandomInteger(0, rest.length), 1);
//  };
// };


var createNotice = function (count) {
  var notice = {
    'author': {
      'avatar': 'img/avatars/user0' + (count + 1) + '.png'
    },
    'offer': {
      'title': NOTICE_TITLES[count],
      'address': locationX + ', ' + locationY,
      'price': getRandomIntegerFromInterval(1000, 1000000),
      'type': getRandomElementFromArray(NOTICE_TYPES),
      'rooms': getRandomIntegerFromInterval(1, 5),
      'guests': getRandomIntegerFromInterval(1, 8), // В задании интервал не указан. ПОэтому придумала свой
      'checkin': getRandomElementFromArray(NOTICE_CHECK_OUT_IN),
      'checkout': getRandomElementFromArray(NOTICE_CHECK_OUT_IN),
      'features': NOTICE_FEATURES.slice(getRandomIntegerFromInterval(-(NOTICE_FEATURES.length - 1), NOTICE_FEATURES.length - 1)), // Или лучше вынести в отдельную функцию?
      'description': '',
      'photos': NOTICE_PHOTOS,
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

var notices = getNotices(8);
