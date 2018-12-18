'use strict';

(function () {

  var ESC_KEYCODE = 27;

  var DEBOUNCE_TIMEOUT = 500;

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

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  var debounce = function (cb) {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    var lastTimeout = setTimeout(cb, DEBOUNCE_TIMEOUT);
  };

  window.util = {
    getRandomIntegerFromInterval: getRandomIntegerFromInterval,
    getRandomElementFromArray: getRandomElementFromArray,
    shuffleArray: shuffleArray,
    getRandomSubarray: getRandomSubarray,
    isEscEvent: isEscEvent,
    debounce: debounce
  };
})();
