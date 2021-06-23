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

(() => {
  const mockGoods = [];
  const goodList = document.querySelector(`.good__list`);

  const goodItemFactory = (i) => {
    return {
      name: `Перфоратор BOSCH BFG ${getRandomArbitrary(1, 9)}000`,
      oldPrice: getRandomArbitrary(5500, 10000),
      price: getRandomArbitrary(500, 5000),
      img: `img/bosch-bfg-${getRandom([2000, 3000, 6000, 9000])}.jpg`,
      uuid: i,
      stock: Boolean(Math.round(Math.random())),
    }
  };

  const getRandom = (list) => {
    return list[Math.floor((Math.random()*list.length))];
  }

  const getRandomArbitrary = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
  }

  const createMockGoods = () => {
    for (let i = 0; i < 10; i++) {
      mockGoods.push(goodItemFactory(i));
    }
  };

  const renderGoodsOnPage = () => {
    const limit = goodList.dataset.limit;

    for (let i = 0; i < limit; i++) {
      renderGoodItemElement(mockGoods[i]);
    }
  };

  const renderGoodItemElement = ({name, oldPrice, price, img, stock, uuid}) => {
    goodList.insertAdjacentHTML(`beforeend`, `<li class="good__item" data-uuid="${uuid}">
      <div class="flag ${stock ? '' : 'hidden'}">
        <div class="flag__item"><span>NEW</span></div>
      </div>
      <div class="good__img">
        <img src="${img}" width="144" height="128"
             alt="${name}">
      </div>
      <div class="good__item-buttons">
        <a href="" class="button good__buy">
          <svg aria-hidden="true" focusable="false" width="15" height="15" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <g opacity=".3" fill="#fff">
              <path
                d="M4.5 15a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12.5 15a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM15 2H4.07l-.42-2H0v2h2.03l1.99 9H15V9H9.44L15 6.95V2z"/>
            </g>
          </svg>
          КУПИТЬ
        </a>
        <button type="button" class="button good__bookmark">В ЗАКЛАДКИ</button>
      </div>
      <h3>${name}</h3>
      <del>${oldPrice} Р.</del>
      <a href="" class="button good__view" aria-label="Заказать товар">${price} Р.</a>
    </li>`);
  };

  createMockGoods();
  renderGoodsOnPage();
})();
