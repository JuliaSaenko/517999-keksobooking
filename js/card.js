'use strict';

(function () {

  var map = document.querySelector('.map');
  var mapContainer = map.querySelector('.map__filters-container');
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
  var cardTemplate = document.querySelector('#card').content;

  var PlaceType = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
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

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closePopup);
  };

  var closePopup = function () {
    var noticeCard = map.querySelector('.map__card.popup');
    if (noticeCard) {
      map.removeChild(noticeCard);
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  var openPopup = function (card) {
    closePopup();
    map.insertBefore(renderCards(card), mapContainer);
    document.addEventListener('keydown', onPopupEscPress);

    var closePopupButton = document.querySelector('.popup__close');
    closePopupButton.addEventListener('click', closePopup);
  };

  var closeAllPopups = function () {
    var noticeCards = map.querySelectorAll('.map__card');
    [].forEach.call(noticeCards, function (noticeCard) {
      closePopup(noticeCard);
    });
  };

  var renderCards = function (card) {
    var cardElement = mapCardTemplate.cloneNode(true);
    var featuresItems = cardElement.querySelector('.popup__features');
    var photosItems = cardElement.querySelector('.popup__photos');

    if (card.offer.title) {
      cardElement.querySelector('.popup__title').textContent = card.offer.title;
    } else {
      cardElement.querySelector('.popup__title').remove();
    }

    if (card.offer.address) {
      cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
    } else {
      cardElement.querySelector('.popup__text--address').remove();
    }

    if (card.offer.price) {
      cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
    } else {
      cardElement.querySelector('.popup__text--price').remove();
    }

    if (card.offer.type) {
      cardElement.querySelector('.popup__type').textContent = PlaceType[card.offer.type];
    } else {
      cardElement.querySelector('.popup__type').remove();
    }

    if (card.offer.rooms && card.offer.guests) {
      cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
    } else {
      cardElement.querySelector('.popup__text--capacity').remove();
    }

    if (card.offer.checkin && card.offer.checkout) {
      cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
    } else {
      cardElement.querySelector('.popup__text--time').remove();
    }

    if (card.offer.description) {
      cardElement.querySelector('.popup__description').textContent = card.offer.description;
    } else {
      cardElement.querySelector('.popup__description').remove();
    }

    if (card.offer.photos) {
      photosItems.innerHTML = '';
      photosItems.appendChild(renderPhoto(card));
    } else {
      photosItems.remove();
    }

    if (card.author.avatar) {
      cardElement.querySelector('.popup__avatar').src = card.author.avatar;
    } else {
      cardElement.querySelector('.popup__avatar').remove();
    }

    if (card.offer.features) {
      featuresItems.innerHTML = '';
      featuresItems.appendChild(renderFeatures(card.offer.features));
    } else {
      featuresItems.remove();
    }

    return cardElement;
  };

  window.card = {
    onPopupEscPress: onPopupEscPress,
    closePopup: closePopup,
    openPopup: openPopup,
    closeAllPopups: closeAllPopups,
    renderCards: renderCards
  };
})();
