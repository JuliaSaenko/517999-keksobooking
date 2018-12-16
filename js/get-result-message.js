'use strict';

(function () {
  var mainBlock = document.querySelector('main');
  var successTemplate = document.querySelector('#success')
                        .content
                        .querySelector('.success');
  var errorTemplate = document.querySelector('#error')
                        .content
                        .querySelector('.error');

  var onResultMessageEscPress = function (evt) {
    window.util.isEscEvent(evt, closeResultMessage);
  };

  var closeResultMessage = function () {
    var resultMessage = mainBlock.querySelector('.success') || mainBlock.querySelector('.error');
    if (resultMessage) {
      mainBlock.removeChild(resultMessage);
      document.removeEventListener('keydown', onResultMessageEscPress);
    }
  };

  var onSuccessMessageClick = function () {
    var resultMessage = successTemplate.cloneNode(true);
    mainBlock.appendChild(resultMessage);
    document.addEventListener('keydown', onResultMessageEscPress);
    resultMessage.addEventListener('click', closeResultMessage);
    document.querySelector('form.ad-form').reset();
  };

  var onErrorMessageClick = function (error) {
    var resultMessage = errorTemplate.cloneNode(true);
    var resultMessageCloseButton = resultMessage.querySelector('error__button');
    var resultMessageContent = resultMessage.querySelector('.error__message');
    resultMessageContent.textContent = resultMessageContent.textContent + '\r\n' + error;
    resultMessageContent.style.whiteSpace = 'pre';
    mainBlock.appendChild(resultMessage);
    document.addEventListener('keydown', onResultMessageEscPress);
    resultMessage.addEventListener('click', closeResultMessage);
    resultMessageCloseButton.addEventListener('click', closeResultMessage);
  };

  window.getResultMessage = {
    onSuccessMessageClick: onSuccessMessageClick,
    onErrorMessageClick: onErrorMessageClick
  };
})();
