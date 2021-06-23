'use strict';
(() => {
  const aboutContactsButtonElement = document.querySelector(`.about__contacts-button`);
  const writeUsElement = document.querySelector(`.write-us`);
  const writeUsForm = document.querySelector(`.write-us__form`);
  const mapPreviewElement = document.querySelector(`.map-preview`);
  const contactsMapElement = document.querySelector(`.contacts-map`);
  const serviceItemElements = document.querySelectorAll(`.service__item`);
  const serviceSliderItemElements = document.querySelectorAll(`.service__slider-item`);
  const promoSliderItemElements = document.querySelectorAll(`.promo-slider__item`);
  const sliderButtonBackElement = document.querySelector(`.promo-slider__button--back`);
  const sliderButtonNextElement = document.querySelector(`.promo-slider__button--next`);
  const sliderControlsForm = document.querySelector(`.slider-controls`);
  const basketInfoElement = document.querySelector(`.basket-info`);
  const basketInfoProceedElement = document.querySelector(`.basket-info__proceed`);

  const POPUP_SHOW_CLASS = `popup--show`;
  const SERVICE_ITEM_ACTIVE_CLASS = `service__item--active`;
  const SERVICE_ITEM_ACTIVE_HIDDEN_CLASS = `service__slider-item--hidden`;
  const PROMO_SLIDER_ITEM_HIDDEN_CLASS = `promo-slider__item--hidden`;

  const storage = {};

  try {
    storage.name = localStorage.getItem(`name`);
    storage.email = localStorage.getItem(`email`);
  } catch (err) {
    storage.name = null;
    storage.email = null;
  }

  const onPopupCloseClick = evt => {
    evt.preventDefault();
    let popup = evt.target.closest(`.popup`);
    popup.classList.remove(POPUP_SHOW_CLASS);

    evt.target.removeEventListener(`click`, onPopupCloseClick);
  };

  const findPopupCloseElement = popup => {
    return popup.querySelector(`.popup__close`);
  };

  const focusForm = () => {
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

  const onAboutContactsButtonElementClick = evt => {
    evt.preventDefault();
    writeUsElement.classList.add(POPUP_SHOW_CLASS);

    focusForm();

    let popupCloseElement = findPopupCloseElement(writeUsElement);
    popupCloseElement.addEventListener(`click`, onPopupCloseClick);
  };

  const onMapPreviewElementClick = evt => {
    evt.preventDefault();
    contactsMapElement.classList.add(POPUP_SHOW_CLASS);

    let popupCloseElement = findPopupCloseElement(contactsMapElement);
    popupCloseElement.addEventListener(`click`, onPopupCloseClick);

    popupCloseElement.addEventListener(`click`, onPopupCloseClick);
  }

  const onWriteUsFormSubmit = () => {
    if (emailElement.value) {
      localStorage.setItem(`email`, emailElement.value);
    }
    if (nameElement.value) {
      localStorage.setItem(`name`, nameElement.value);
    }
  };

  const onDocumentKeyDown = evt => {
    if (evt.keyCode === 27) {
      if (writeUsElement) {
        writeUsElement.classList.remove(POPUP_SHOW_CLASS);
      }
      if (contactsMapElement) {
        contactsMapElement.classList.remove(POPUP_SHOW_CLASS);
      }
      if (basketInfoElement) {
        basketInfoElement.classList.remove(POPUP_SHOW_CLASS);
      }

      evt.preventDefault();
    }
  };

  const onServiceItemButtonClick = dataset => {
    return (evt) => {
      evt.preventDefault();
      let serviceItem = evt.target.closest(`.service__item`);

      if (serviceItem.classList.contains(SERVICE_ITEM_ACTIVE_CLASS)) {
        return;
      }

      Array.from(serviceItemElements).forEach((serviceItemElement) => {
        serviceItemElement.classList.remove(SERVICE_ITEM_ACTIVE_CLASS);
      });
      serviceItem.classList.add(SERVICE_ITEM_ACTIVE_CLASS);

      Array.from(serviceSliderItemElements).forEach((serviceSlide) => {
        if (serviceSlide.classList.contains(dataset)) {
          serviceSlide.classList.remove(SERVICE_ITEM_ACTIVE_HIDDEN_CLASS);
        } else {
          serviceSlide.classList.add(SERVICE_ITEM_ACTIVE_HIDDEN_CLASS);
        }
      });
    }
  };

  const addServiceSliderHandlers = () => {
    Array.from(serviceItemElements).forEach((element) => {
      let dataset = element.dataset.slide;

      element.addEventListener(`click`, onServiceItemButtonClick(dataset));
    });
  }

  const flipThoughPromoSliders = (evt, getPosition) => {
    evt.preventDefault();

    for (let i in promoSliderItemElements) {
      if (promoSliderItemElements[i].classList.contains(PROMO_SLIDER_ITEM_HIDDEN_CLASS)) {
        continue;
      }

      promoSliderItemElements[i].classList.add(PROMO_SLIDER_ITEM_HIDDEN_CLASS);
      let position = getPosition(i);
      promoSliderItemElements[position].classList.remove(PROMO_SLIDER_ITEM_HIDDEN_CLASS);

      let dataset = promoSliderItemElements[position].dataset.slide;
      let radioInput = sliderControlsForm.querySelector(`#${dataset}`);
      radioInput.checked = true;

      break;
    }
  };

  const onSliderButtonNextElementClick = evt => {
    flipThoughPromoSliders(evt, i => (+i === promoSliderItemElements.length - 1) ? 0 : +i + 1);
  };

  const onSliderButtonBackElementClick = (evt) => {
    flipThoughPromoSliders(evt, i => (+i === 0) ? promoSliderItemElements.length - 1 : 0);
  };

  const onSliderFormChange = evt => {
    evt.preventDefault();
    let inputRadio = evt.target;

    if (!inputRadio.classList.contains(`slider-controls__input`)) {
      return;
    }

    Array.from(promoSliderItemElements).forEach((slider) => {
      if (slider.dataset.slide === inputRadio.id) {
        slider.classList.remove(PROMO_SLIDER_ITEM_HIDDEN_CLASS);
      } else {
        slider.classList.add(PROMO_SLIDER_ITEM_HIDDEN_CLASS);
      }
    });
  };

  const addPromoSliderHandlers = () => {
    sliderButtonNextElement.addEventListener(`click`, onSliderButtonNextElementClick);
    sliderButtonBackElement.addEventListener(`click`, onSliderButtonBackElementClick);
    sliderControlsForm.addEventListener(`change`, onSliderFormChange);
  }

  const onGoodBuyElementClick = evt => {
    let buyButton = evt.target.closest(`.good__buy`);
    if (buyButton && evt.target.classList.contains(`good__buy`)) {
      evt.preventDefault();
      basketInfoElement.classList.add(POPUP_SHOW_CLASS);

      let popupCloseElement = findPopupCloseElement(basketInfoElement);
      popupCloseElement.addEventListener(`click`, onPopupCloseClick);
    }
  };

  const onBasketInfoProceedElementClick = evt => {
    evt.preventDefault();
    basketInfoElement.classList.remove(POPUP_SHOW_CLASS);
  }

  const addHandlers = () => {
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
