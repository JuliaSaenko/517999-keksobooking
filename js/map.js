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

var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;
var BLOCK_WIDTH = document.querySelector('.map').clientWidth;


var map = document.querySelector('.map');
map.classList.remove('map--faded');

var mapContainer = map.querySelector('.map__filters-container');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');

var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

var getRandomIntegerFromInterval = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomElementFromArray = function (array) {
  return array[getRandomIntegerFromInterval(0, array.length - 1)];
};

var getRandomNumber = function (from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
};

var getRandomLengthOfArray = function (array) {
  shuffleArray(array);
  return array.slice(getRandomNumber(1, array.length - 1));
};

var createNotice = function (count) {
  var locationX = getRandomIntegerFromInterval(PIN_WIDTH / 2, BLOCK_WIDTH - PIN_WIDTH / 2);
  var locationY = getRandomIntegerFromInterval(130, 630);

  var notice = {
    'author': {
      'avatar': 'img/avatars/user' + (count + 1 < 10 ? '0' + (count + 1) : count + 1) + '.png'
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
      'features': getRandomLengthOfArray(NOTICE_FEATURES),
      'description': '',
      'photos': shuffleArray(NOTICE_PHOTOS),
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

var renderPin = function (notice) {
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pin = mapPinTemplate.cloneNode(true);

  pin.style.left = (notice.location.x - PIN_WIDTH / 2) + 'px';
  pin.style.top = (notice.location.y - PIN_HEIGHT) + 'px';
  pin.querySelector('img').src = notice.author.avatar;
  pin.querySelector('img').alt = notice.offer.title;

  return pin;
};

function renderPins(list) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < list.length; i++) {
    var pins = renderPin(list[i]);
    fragment.appendChild(pins);
  }
  return fragment;
}

function renderFeatures(features) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < features.length; i++) {
    var featuresItem = document.createElement('li');
    featuresItem.className = 'popup__feature popup__feature--' + features[i];
    fragment.appendChild(featuresItem);
  }
  return fragment;
}

var cardTemplate = document.querySelector('#card').content;

var renderPhoto = function (card) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < card.offer.photos.length; i++) {
    var createImg = cardTemplate.querySelector('.map__card')
    .querySelector('.popup__photo').cloneNode(true);

    createImg.src = card.offer.photos[i];
    fragment.appendChild(createImg);
  }
  return fragment;
};

var renderCards = function (card) {
  var cardElement = mapCardTemplate.cloneNode(true);
  var offerType;
  var featuresItems = cardElement.querySelector('.popup__features');

  if (card.offer.type === 'flat') {
    offerType = 'Квартира';
  } else if (card.offer.type === 'bungalo') {
    offerType = 'Бунгало';
  } else if (card.offer.type === 'house') {
    offerType = 'Дом';
  } else if (card.offer.type === 'palace') {
    offerType = 'Дворец';
  }

  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = offerType;
  cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после' + card.offer.checkin + ' выезд до ' + card.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = card.offer.description;
  cardElement.querySelector('.popup__photos').textContent = '';
  cardElement.querySelector('.popup__photos').appendChild(renderPhoto(card));
  cardElement.querySelector('.popup__avatar').src = card.author.avatar;

  featuresItems.textContent = '';
  featuresItems.appendChild(renderFeatures(card.offer.features));

  return cardElement;
};

var mapPinList = map.querySelector('.map__pins');
mapPinList.appendChild(renderPins(notices));

map.insertBefore(renderCards(getRandomElementFromArray(notices)), mapContainer);
