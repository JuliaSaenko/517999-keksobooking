'use strict';

(function () {

  var map = document.querySelector('.map'); // map
  var mapContainer = map.querySelector('.map__filters-container');

  var PIN_WIDTH = 50; // data
  var PIN_HEIGHT = 40;

  var openPopup = function (card) {
    window.card.closePopup();
    map.insertBefore(window.card.renderCards(card), mapContainer);
    document.addEventListener('keydown', window.card.onPopupEscPress);

    var closePopupButton = document.querySelector('.popup__close');
    closePopupButton.addEventListener('click', window.card.closePopup);
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

  window.pin = renderPin;
})();
