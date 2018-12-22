'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var DEFAULT_HEIGHT = 40;
  var DEFAULT_WIDTH = 40;

  var defaultAvatar = 'img/muffin-grey.svg';
  var adForm = document.querySelector('.ad-form');

  var avatarInput = adForm.querySelector('.ad-form-header__input');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview');
  var avatarPreviewImg = adForm.querySelector('.ad-form-header__preview img');
  var photoInput = adForm.querySelector('.ad-form__input');
  var photoContainer = adForm.querySelector('.ad-form__photo-container');
  var photoDiv = adForm.querySelector('.ad-form__photo');

  avatarInput.addEventListener('change', function () {
    var fileAvatar = avatarInput.files[0];
    var fileName = fileAvatar.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreviewImg.src = reader.result;
        avatarPreviewImg.width = avatarPreview.offsetWidth;
        avatarPreviewImg.height = avatarPreview.offsetHeight;
        avatarPreviewImg.style = 'border-radius: 5px';
        avatarPreview.style = 'padding: 0';
      });

      reader.readAsDataURL(fileAvatar);
    }
  });

  photoInput.addEventListener('change', function () {
    var filePhoto = photoInput.files[0];
    var fileName = filePhoto.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var photosBlock = document.createElement('div');
        var photo = document.createElement('img');
        photosBlock.classList.add('ad-form__photo');
        photosBlock.id = 'photo';
        photoContainer.insertBefore(photosBlock, photoDiv);
        photo.setAttribute('src', reader.result);
        photo.width = photosBlock.offsetWidth;
        photo.height = photosBlock.offsetHeight;
        photo.style = 'border-radius: 5px';
        photosBlock.appendChild(photo);
      });
      reader.readAsDataURL(filePhoto);
    }
  });

  var resetAvatarPhoto = function () {
    avatarPreviewImg.src = defaultAvatar;
    avatarPreviewImg.width = DEFAULT_WIDTH;
    avatarPreviewImg.height = DEFAULT_HEIGHT;
    avatarPreview.style = '';
  };

  var resetNoticePhotos = function () {
    var housePhotos = adForm.querySelectorAll('#photo');
    housePhotos.forEach(function (photo) {
      photo.remove();
    });
  };

  window.uploadFiles = {
    resetAvatarPhoto: resetAvatarPhoto,
    resetNoticePhotos: resetNoticePhotos
  };
})();
