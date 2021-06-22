`use strict`;
(() => {
  const aboutContactsButtonElement = document.querySelector(`.about-contacts-button`);
  const writeUsElement = document.querySelector(`.write-us`);
  const writeUsForm = document.querySelector(`.write-us-form`);
  const mapPreviewElement = document.querySelector(`.map-preview`);
  const contactsMapElement = document.querySelector(`.contacts-map`);
  const serviceItemElements = document.querySelectorAll(`.service-item`);
  const serviceSliderItemElements = document.querySelectorAll(`.service-slider-item`);
  const promoSliderItemElements = document.querySelectorAll(`.promo-slider-item`);
  const sliderButtonBackElement = document.querySelector(`.slider-button-back`);
  const sliderButtonNextElement = document.querySelector(`.slider-button-next`);
  const sliderControlsForm = document.querySelector(`.slider-controls`);
  const basketInfoElement = document.querySelector(`.basket-info`);
  const basketInfoProceedElement = document.querySelector(`.basket-info-proceed`);

  let isStorageSupport = true;
  let storage = {};

  try {
    storage.name = localStorage.getItem(`name`);
    storage.email = localStorage.getItem(`email`);
  } catch (err) {
    isStorageSupport = false;
  }

  let onPopupCloseClick = (evt) => {
    evt.preventDefault();
    let popup = evt.target.closest(`.popup`);
    popup.classList.remove(`modal-show`);

    evt.target.removeEventListener(`click`, onPopupCloseClick);
  };

  let findPopupCloseElement = (popup) => {
    return popup.querySelector(`.popup-close`);
  };

  let focusForm = () => {
    const emailElement = writeUsElement.querySelector(`#email`);
    const nameElement = writeUsElement.querySelector(`#name`);
    const messageElement = writeUsElement.querySelector(`#message`);

    if (storage.name) {
      nameElement.value = storage.name;
    } else {
      nameElement.focus();
      return;
    }

    if (storage.email) {
      emailElement.value = storage.email;
      messageElement.focus();
    } else {
      emailElement.focus();
    }
  }

  let onAboutContactsButtonElementClick = (evt) => {
    evt.preventDefault();
    writeUsElement.classList.add(`modal-show`);

    focusForm();

    let popupCloseElement = findPopupCloseElement(writeUsElement);
    popupCloseElement.addEventListener(`click`, onPopupCloseClick);

    popupCloseElement.addEventListener(`click`, onPopupCloseClick);
  };

  let onMapPreviewElementClick = (evt) => {
    evt.preventDefault();
    contactsMapElement.classList.add(`modal-show`);

    let popupCloseElement = findPopupCloseElement(contactsMapElement);
    popupCloseElement.addEventListener(`click`, onPopupCloseClick);

    popupCloseElement.addEventListener(`click`, onPopupCloseClick);
  }

  let onWriteUsFormSubmit = () => {
    if (emailElement.value) {
      localStorage.setItem(`email`, emailElement.value);
    }
    if (nameElement.value) {
      localStorage.setItem(`name`, nameElement.value);
    }
  };

  let onDocumentKeyDown = (evt) => {
    if (evt.keyCode === 27) {
      if (writeUsElement) {
        writeUsElement.classList.remove(`modal-show`);
      }
      if (contactsMapElement) {
        contactsMapElement.classList.remove(`modal-show`);
      }
      if (basketInfoElement) {
        basketInfoElement.classList.remove(`modal-show`);
      }
      evt.preventDefault();
    }
  };

  let onServiceItemButtonClick = (dataset) => {
    return (evt) => {
      evt.preventDefault();
      let serviceItem = evt.target.closest(`.service-item`);

      if (serviceItem.classList.contains(`service-item-active`)) {
        return;
      }

      Array.from(serviceItemElements).forEach((serviceItemElement) => {
        serviceItemElement.classList.remove(`service-item-active`);
      });
      serviceItem.classList.add(`service-item-active`);

      Array.from(serviceSliderItemElements).forEach((serviceSlide) => {
        if (serviceSlide.classList.contains(dataset)) {
          serviceSlide.classList.remove(`hidden`);
        } else {
          serviceSlide.classList.add(`hidden`);
        }
      });
    }
  };

  let addServiceSliderHandlers = () => {
    Array.from(serviceItemElements).forEach((element) => {
      let dataset = element.dataset.slide;

      element.addEventListener(`click`, onServiceItemButtonClick(dataset));
    });
  }

  let flipThoughPromoSliders = (evt, getPosition) => {
    evt.preventDefault();

    for (let i in promoSliderItemElements) {
      if (promoSliderItemElements[i].classList.contains(`hidden`)) {
        continue;
      }

      promoSliderItemElements[i].classList.add(`hidden`);
      let position = getPosition(i);
      promoSliderItemElements[position].classList.remove(`hidden`);

      let dataset = promoSliderItemElements[position].dataset.slide;
      let radioInput = sliderControlsForm.querySelector(`#${dataset}`);
      radioInput.checked = true;

      break;
    }
  };

  let onSliderButtonNextElementClick = (evt) => {
    flipThoughPromoSliders(evt, (i) => (+i === promoSliderItemElements.length - 1) ? 0 : +i + 1);
  };

  let onSliderButtonBackElementClick = (evt) => {
    flipThoughPromoSliders(evt, (i) => (+i === 0) ? promoSliderItemElements.length - 1 : 0);
  };

  let onSliderFormChange = (evt) => {
    evt.preventDefault();
    let inputRadio = evt.target;

    if (!inputRadio.classList.contains(`slider-controls-input`)) {
      return;
    }

    Array.from(promoSliderItemElements).forEach((slider) => {
      if (slider.dataset.slide === inputRadio.id) {
        slider.classList.remove(`hidden`);
      } else {
        slider.classList.add(`hidden`);
      }
    });
  };

  let addPromoSliderHandlers = () => {
    sliderButtonNextElement.addEventListener(`click`, onSliderButtonNextElementClick);
    sliderButtonBackElement.addEventListener(`click`, onSliderButtonBackElementClick);
    sliderControlsForm.addEventListener(`change`, onSliderFormChange);
  }

  let onGoodBuyElementClick = (evt) => {
    let buyButton = evt.target.closest(`.good-buy`);
    if (buyButton && evt.target.classList.contains(`good-buy`)) {
      evt.preventDefault();
      basketInfoElement.classList.add(`modal-show`);

      let popupCloseElement = findPopupCloseElement(basketInfoElement);
      popupCloseElement.addEventListener(`click`, onPopupCloseClick);

      popupCloseElement.addEventListener(`click`, onPopupCloseClick);
    }
  };

  let onBasketInfoProceedElementClick = (evt) => {
    evt.preventDefault();
    basketInfoElement.classList.remove(`modal-show`);
  }

  let addHandlers = () => {
    if (aboutContactsButtonElement) {
      aboutContactsButtonElement.addEventListener(`click`, onAboutContactsButtonElementClick);
    }
    if (writeUsForm) {
      writeUsForm.addEventListener(`submit`, onWriteUsFormSubmit);
    }
    if (mapPreviewElement) {
      mapPreviewElement.addEventListener(`click`, onMapPreviewElementClick);
    }
    document.addEventListener(`keydown`, onDocumentKeyDown);
    if (sliderControlsForm) {
      addServiceSliderHandlers();
      addPromoSliderHandlers();
    }
    document.addEventListener(`click`, onGoodBuyElementClick);
    if (basketInfoProceedElement) {
      basketInfoProceedElement.addEventListener(`click`, onBasketInfoProceedElementClick);
    }
  };

  addHandlers();
})();
