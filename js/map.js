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
var NOTICE_TYPES = ['palace', 'flat', 'house', 'bungalo'];

var PlaceType = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var GuestsInRoom = {
  ROOM_1: ['1'],
  ROOM_2: ['1', '2'],
  ROOM_3: ['1', '2', '3'],
  ROOM_100: ['0']
};

var PrisePerPlase = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var NOTICE_CHECK_OUT_IN = ['12:00', '13:00', '14:00'];
var NOTICE_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var NOTICE_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var PIN_WIDTH = 50;
var PIN_HEIGHT = 40;
// var TAIL_HEIGHT = 9;
var BLOCK_WIDTH = document.querySelector('.map').clientWidth;
var MAP_WIDTH = 1200;
var MAP_HEIGHT = 750;

var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;


var map = document.querySelector('.map');

var mapContainer = map.querySelector('.map__filters-container');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
var mapPinsList = map.querySelector('.map__pins');
var mainPin = mapPinsList.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var adFormAddressFieldset = adForm.querySelector('#address');
var adFormRoomFieldset = adForm.querySelector('#room_number');
var adFormCapasityFieldset = adForm.querySelector('#capacity');
var adFormPriceFieldset = adForm.querySelector('#price');
var adFormTypeFieldset = adForm.querySelector('#type');
var adFormCheckInFieldset = adForm.querySelector('#timein');
var adFormCheckOutFieldset = adForm.querySelector('#timeout');

var ESC_KEYCODE = 27;

var shuffleArray = function (array) {
  var clonedArray = array.slice();
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return clonedArray;
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

var getRandomSubarray = function (array) {
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
      'features': getRandomSubarray(NOTICE_FEATURES),
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

var renderFeatures = function (features) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < features.length; i++) {
    var featuresItem = document.createElement('li');
    featuresItem.className = 'popup__feature popup__feature--' + features[i];
    fragment.appendChild(featuresItem);
  }
  return fragment;
};

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
  var featuresItems = cardElement.querySelector('.popup__features');
  var photosItems = cardElement.querySelector('.popup__photos');

  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = PlaceType[card.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после' + card.offer.checkin + ' выезд до ' + card.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = card.offer.description;
  photosItems.innerHTML = '';
  cardElement.querySelector('.popup__photos').appendChild(renderPhoto(card));
  cardElement.querySelector('.popup__avatar').src = card.author.avatar;

  featuresItems.textContent = '';
  featuresItems.appendChild(renderFeatures(card.offer.features));

  return cardElement;
};

var closePopup = function () {
  var noticeCard = map.querySelector('.map__card.popup');
  if (noticeCard) {
    map.removeChild(noticeCard);
    document.removeEventListener('keydown', onPopupEscPress);
  }
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var openPopup = function (card) {
  closePopup();
  map.insertBefore(renderCards(card), mapContainer);
  document.addEventListener('keydown', onPopupEscPress);

  var closePopupButton = document.querySelector('.popup__close');
  closePopupButton.addEventListener('click', closePopup);
};

var renderPin = function (notice) {
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pin = mapPinTemplate.cloneNode(true);

  pin.style.left = (notice.location.x - PIN_WIDTH / 2) + 'px';
  pin.style.top = (notice.location.y - PIN_HEIGHT) + 'px';
  pin.querySelector('img').src = notice.author.avatar;
  pin.querySelector('img').alt = notice.offer.title;
  pin.addEventListener('click', function () {
    openPopup(notice);
  });

  return pin;
};

var renderPins = function (list) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < list.length; i++) {
    var pins = renderPin(list[i]);
    fragment.appendChild(pins);
  }
  return fragment;
};

var notices = getNotices(8);
var pins = renderPins(notices);

var enabledMainPage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = false;
  }
};

var setAddressCoords = function (x, y) {
  adFormAddressFieldset.value = x + ', ' + y;
};

var roomChangingFieldset = function () {
  var guests = GuestsInRoom['ROOM_' + adFormRoomFieldset.value];
  var isMatch = guests.includes(adFormCapasityFieldset.value);
  if (isMatch) {
    adFormCapasityFieldset.setCustomValidity('');
  } else {
    adFormCapasityFieldset.setCustomValidity('"Это вам не подходит"');
  }
};

var onMainPinMouseUp = function () {
  enabledMainPage();
  mapPinsList.appendChild(pins);
  setAddressCoords(MAP_WIDTH / 2, MAP_HEIGHT / 2);
  mainPin.removeEventListener('mouseup', onMainPinMouseUp);
};

for (var i = 0; i < adFormFieldsets.length; i++) {
  adFormFieldsets[i].disabled = true;
}

mainPin.addEventListener('mousedown', function (downEvt) {
  downEvt.preventDefault();

  var startCoords = {
    x: downEvt.pageX,
    y: downEvt.pageY
  };

  var onPinMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    enabledMainPage(pins);

    var Borders = {
      top: LOCATION_Y_MIN,
      bottom: LOCATION_Y_MAX,
      left: 0,
      right: map.clientWidth - mainPin.clientWidth
    };

    var shift = {
      x: startCoords.x - moveEvt.pageX,
      y: startCoords.y - moveEvt.pageY
    };

    var pinShifted = {
      x: mainPin.offsetLeft - shift.x,
      y: mainPin.offsetTop - shift.y
    };

    if (pinShifted.x >= Borders.left && pinShifted.x <= Borders.right) {
      mainPin.style.left = pinShifted.x + 'px';
    }

    if (pinShifted.y >= Borders.top && pinShifted.y <= Borders.bottom) {
      mainPin.style.top = pinShifted.y + 'px';
    }

    setAddressCoords(pinShifted.x, pinShifted.y);

    startCoords = {
      x: moveEvt.pageX,
      y: moveEvt.pageY
    };
  };

  function onPinMouseUp(upEvt) {
    upEvt.preventDefault();
    enabledMainPage(pins);
    document.removeEventListener('mousemove', onPinMouseMove);
    document.removeEventListener('mouseup', onPinMouseUp);
  }

  document.addEventListener('mousemove', onPinMouseMove);
  document.addEventListener('mouseup', onPinMouseUp);
});

mainPin.addEventListener('mouseup', onMainPinMouseUp);

adFormRoomFieldset.addEventListener('change', roomChangingFieldset);
adFormCapasityFieldset.addEventListener('change', roomChangingFieldset);

adFormTypeFieldset.addEventListener('change', function () {
  var key = adFormTypeFieldset.value.toUpperCase();
  adFormPriceFieldset.min = PrisePerPlase[key];
  adFormPriceFieldset.placeholder = PrisePerPlase[key];
});
adFormCheckInFieldset.addEventListener('change', function () {
  var checkTime = adFormCheckInFieldset.value;
  adFormCheckOutFieldset.value = checkTime;
});
adFormCheckOutFieldset.addEventListener('change', function () {
  var checkTime = adFormCheckOutFieldset.value;
  adFormCheckInFieldset.value = checkTime;
});
