'use strict';

(function () {

  var PIN_WIDTH = 50; // data
  var PIN_HEIGHT = 40;

  var renderPin = function (notice) {
    var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var pin = mapPinTemplate.cloneNode(true);

    pin.style.left = (notice.location.x - PIN_WIDTH / 2) + 'px';
    pin.style.top = (notice.location.y - PIN_HEIGHT) + 'px';
    pin.querySelector('img').src = notice.author.avatar;
    pin.querySelector('img').alt = notice.offer.title;
    pin.addEventListener('click', function () {
      window.card.openPopup(notice);
    });

    return pin;
  };

  window.getPin = renderPin;
})();
