'use strict';

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
var NOTICE_TYPES = ['flat', 'house', 'bungalo'];
var NOTICE_CHECK_OUT_IN = ['12:00', '13:00', '14:00'];
var NOTICE_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var NOTICE_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var LABEL_WIDTH = 40;
var LABEL_HEIGHT = 40;

var map = document.querySelector('.map');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapPinList = map.querySelector('.map__pins');
var mapContainer = map.querySelector('.map__filters-container');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');

var showElement = function (element, className) { // Нашла в книге такую ""штуку"", можно использовать?
  element.classList.remove(className);
};

var getRandomIntegerFromInterval = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomElementFromArray = function (array) {
  return array[getRandomIntegerFromInterval(0, array.length - 1)];
};

var locationX = getRandomIntegerFromInterval(300, 900);
var locationY = getRandomIntegerFromInterval(100, 500);

// var getShuffledArray = function (array) {
//  var originalArray = array.slice(0);
//  var shuffledArray = [];
//  for (var i = 0; i < array.length; i++) {
//    var randomIndex = getRandomIntegerFromInterval(0, originalArray.length - 1);
//    shuffledArray[i] = originalArray[randomIndex];
//    originalArray.splice(randomIndex, 1);
//  }
//  return shuffledArray;
// }
// ;

var getRandomFromOnce = function (array) {
  var arrayCopy = array.slice();
  var rest = [];
  return function () {
    rest = rest.length > 0 ? rest : rest.concat(arrayCopy);
    return rest.splice(getRandomIntegerFromInterval(0, rest.length), 1);
  };
};

var getFeatures = function () {
  var features = [];
  var length = getRandomIntegerFromInterval(1, NOTICE_FEATURES.length);
  var getRandomFeature = getRandomFromOnce(NOTICE_FEATURES);
  for (var i = 0; i < length; i++) {
    features.push(getRandomFeature());
  }
  return features;
};

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
      'guests': getRandomIntegerFromInterval(1, 8),
      'checkin': getRandomElementFromArray(NOTICE_CHECK_OUT_IN),
      'checkout': getRandomElementFromArray(NOTICE_CHECK_OUT_IN),
      'features': getFeatures(),
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

var getFeaturesList = function (features) {
  var list = '';

  for (var i = 0; i < features.length; i++) {
    list += '<li class="feature feature--' + features[i] + '"></li>';
  }

  return list;
};

showElement(map, 'map--faded');

var renderPins = function (notice) {
  var pinElement = mapPinTemplate.cloneNode(true);

  pinElement.style.left = (notice.location.x - LABEL_WIDTH / 2) + 'px';
  pinElement.style.top = (notice.location.y - LABEL_HEIGHT) + 'px';
  pinElement.querySelector('img').src = notice.author.avatar;

  return pinElement;
};

var renderCards = function (card) {
  var cardElement = mapCardTemplate.cloneNode(true);
  var offerType = '';
  var rubSign = '&#x20bd';
  var featuresItems = getFeaturesList(card.offer.features);

  if (card.offer.type === 'flat') {
    offerType = 'Квартира';
  } else if (card.offer.type === 'bungalo') {
    offerType = 'Бунгало';
  } else if (card.offer.type === 'house') {
    offerType = 'Дом';
  }

  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = card.offer.price + rubSign + '/ночь';
  cardElement.querySelector('.popup__type').textContent = offerType;
  cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после' + card.offer.checkin + ' выезд до ' + card.offer.checkout;
  cardElement.querySelector('.popup__features').insertAdjacentHTML('afterbegin', featuresItems); // Нашла еще innerHTML, но MDN говорит, что лучше insertAdjacentHTML
  cardElement.querySelector('..popup__description').textContent = card.offer.description;
  cardElement.querySelector('.popup__avatar').src = card.author.avatar;

  return cardElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < notices; i++) {
  fragment.appendChild(renderPins(notices[i]));
}

mapPinList.appendChild(fragment);
map.insertBefore(renderCards(getRandomIntegerFromInterval(notices)), mapContainer);
