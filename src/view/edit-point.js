import {humanizeFullDateAndTime} from '../utils/point.js';
import {optionsMap} from '../const.js';
import SmartView from './smart.js';
import {isArrayEmpty} from '../utils/common.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const DATEPICKER_FORMAT = 'd/m/y H:i';

const createDestinationTemplate = (destination) => (
  destination.map((item) => (
    `<option value="${item.name}"></option>`
  )).join('')
);

const createPictureContainerTemplate = (destination) => (
  destination.pictures
    .map((item) => (
      `<img class="event__photo" src="${item.src}" alt="${item.description}">`
    ))
    .join(' ')
);

const createEventTypesListTemplate = (currentType) => {
  const eventTypes = Array.from(optionsMap.keys());

  const eventTypesList = eventTypes.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`).join('');

  return eventTypesList;
};

const createOffersList = ({
  type,
  offers,
}) => {
  const availableOffers = optionsMap.get(type);

  const offersList = availableOffers.map((offer) => {
    const {
      title,
      price,
      id,
    } = offer;
    const isOfferSelected = offers ? offers.some((item) => item.title === title) : false;

    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${id}" type="checkbox" name="event-offer-${type}" ${isOfferSelected ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${type}-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
      </div>`;
  }).join('');

  return offersList;
};

const createEditPointTemplate = (data, destinations) => {
  const {
    basePrice,
    destination,
    type,
    dateFrom,
    dateTo,
    isOptions,
    isDescription,
    isPictures,
  } = data;

  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventTypesListTemplate(type)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
            ${createDestinationTemplate(destinations)}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeFullDateAndTime(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeFullDateAndTime(dateTo)}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
      <section class="event__section  event__section--offers"  ${isOptions ? '' : 'visually-hidden'}>
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createOffersList(data)}
        </div>
      </section>
          <section class="event__section  event__section--destination" ${isDescription ? '' : 'visually-hidden'}>
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
            <div class="event__photos-container" ${isPictures ? '' : 'visually-hidden'}>
            <div class="event__photos-tape">
            ${createPictureContainerTemplate(destination)}
            </div>
            </div>
          </div>
          </section>
        </section>
      </form>
    </li>`;
};

export default class EditPoint extends SmartView {
  constructor(points, destinations) {
    super();
    this._data = EditPoint.parsePointToData(points);
    this._destinations = destinations;
    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);
    this._editFormCloseHandler = this._editFormCloseHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._destinationToggleHandler = this._destinationToggleHandler.bind(this);
    this._offersSelectorClickHandler = this._offersSelectorClickHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._setDateFromPicker();
    this._setDateToPicker();
    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditPointTemplate(this._data, this._destinations);
  }

  _setDateFromPicker() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    this._dateFromPicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        dateFormat: DATEPICKER_FORMAT,
        enableTime: true,
        default: this._data.dateFrom,
        onChange: this._dateFromChangeHandler,
      },
    );
  }

  _setDateToPicker() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    this._dateToPicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        dateFormat: DATEPICKER_FORMAT,
        enableTime: true,
        default: this._data.dateTo,
        minDate: this._data.dateFrom,
        onChange: this._dateToChangeHandler,
      },
    );
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    });
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDateFromPicker();
    this._setDateToPicker();
    this.setEditFormSubmitHandler(this._callbacks.formSubmit);
    this.setEditFormCloseHandler(this._callbacks.formClose);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('click', this._typeToggleHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationToggleHandler);
    if (this._data.isOptions) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('click', this._offersSelectorClickHandler);
    }
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    if (!evt.target.classList.contains('event__type-label')) {
      return;
    }

    const emptyOffers = [];
    const currentType = evt.target.textContent;
    const options = optionsMap.get(currentType);

    this.updateData({
      type: currentType,
      offers: emptyOffers,
      isOptions: isArrayEmpty(options) ,
    });
  }

  _destinationToggleHandler(evt) {
    evt.preventDefault();
    const destinationFromList = this._destinations.find((destination) =>  destination.name === evt.target.value);

    this.updateData({
      destination: destinationFromList,
      isDescription: isArrayEmpty(destinationFromList.description),
      isPictures: isArrayEmpty(destinationFromList.pictures),
    });
  }

  _offersSelectorClickHandler(evt) {
    evt.preventDefault();
    const target = evt.target.closest('input');
    if (!target) {
      return;
    }
    const clickedOption = target.dataset.title;
    const availableOptions = optionsMap.get(this._data.type);
    const pointOffers = this._data.offers;

    const selectedOption = availableOptions.find((item) => item.title === clickedOption);
    const optionToAdd = pointOffers.find((item) => item.title === clickedOption);

    const selectedOptions = optionToAdd ? pointOffers.filter((item) => item.title !== clickedOption) : [...pointOffers, selectedOption];

    this.updateData({
      offers: selectedOptions,
    });
  }

  _editFormSubmitHandler(evt) {
    evt.preventDefault();
    this._callbacks.formSubmit(EditPoint.parseDataToPoint(this._data));
  }

  setEditFormSubmitHandler(callback) {
    this._callbacks.formSubmit = callback;
    this.getElement()
      .querySelector('form')
      .addEventListener('submit', this._editFormSubmitHandler);
  }

  _editFormCloseHandler(evt) {
    evt.preventDefault();
    this._callbacks.formClose();
  }

  setEditFormCloseHandler(callback) {
    this._callbacks.formClose = callback;
    this.getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._editFormCloseHandler);
  }

  reset(points) {
    this.updateData(
      EditPoint.parsePointToData(points),
    );
  }

  static parsePointToData(points) {
    return Object.assign(
      {},
      points,
      {
        isOptions: isArrayEmpty(optionsMap.get(points.type)),
        isDescription: isArrayEmpty(points.destination.description),
        isPictures: isArrayEmpty(points.destination.pictures),
      },
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDescription;
    delete data.isPictures;
    delete data.isOptions;

    return data;
  }
}

