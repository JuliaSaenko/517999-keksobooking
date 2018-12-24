'use strict';

(function () {
  var mainBlock = document.querySelector('main');
  var successTemplate = document.querySelector('#success')
                        .content
                        .querySelector('.success');
  var errorTemplate = document.querySelector('#error')
                        .content
                        .querySelector('.error');

  var isError = false;

  var onResultMessageEscPress = function (evt) {
    window.util.isEscEvent(evt, onCloseResultMessageBtnClick);
  };

  var onCloseButton = function (evt) {
    evt.stopPropagation();
    onCloseResultMessageBtnClick();
  };

  var onCloseResultMessageBtnClick = function () {
    var resultMessage = mainBlock.querySelector('.success') || mainBlock.querySelector('.error');
    if (resultMessage.className === 'error') {
      isError = false;
      window.map.deactivatePage();
    }
    mainBlock.removeChild(resultMessage);
    document.removeEventListener('keydown', onResultMessageEscPress);
  };

  var onSuccessMessageClick = function () {
    var resultMessage = successTemplate.cloneNode(true);
    mainBlock.appendChild(resultMessage);
    document.addEventListener('keydown', onResultMessageEscPress);
    resultMessage.addEventListener('click', onCloseResultMessageBtnClick);
    document.querySelector('form.ad-form').reset();
  };

  var onErrorMessageClick = function (error) {
    if (!isError) {
      isError = true;
      var resultMessage = errorTemplate.cloneNode(true);
      var resultMessageCloseButton = resultMessage.querySelector('error__button');
      var resultMessageContent = resultMessage.querySelector('.error__message');
      resultMessageContent.textContent = resultMessageContent.textContent + '\r\n' + error;
      resultMessageContent.style.whiteSpace = 'pre';
      mainBlock.appendChild(resultMessage);
      document.addEventListener('keydown', onResultMessageEscPress);
      resultMessage.addEventListener('click', onCloseResultMessageBtnClick);
      resultMessageCloseButton.addEventListener('click', onCloseButton);
    }
  };

  window.getResultMessage = {
    onSuccessMessageClick: onSuccessMessageClick,
    onErrorMessageClick: onErrorMessageClick
  };
})();
