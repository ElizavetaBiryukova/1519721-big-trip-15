import {
  humanizeFullDateAndTime
} from '../utils/point.js';
import {
  DESTINATION,
  TYPES,
  optionsMap
} from '../mock/task-mock';
import AbstractView from './abstract.js';


const createDestinationTemplate = (destinations) => {
  let optionsMarkup = '';
  destinations.forEach((destination) => {
    optionsMarkup += `<option value="${destination}"></option>`;
  });
  return optionsMarkup;
};

const createEventTypesListTemplate = () => {
  const eventTypesList = TYPES.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`).join('');

  return eventTypesList;
};

const createOffersList = ({
  type,
  offers,
}) => {
  const availableOffers = optionsMap.get(type);

  const offersList = availableOffers.map((option) => {
    const {
      title,
      price,
      id,
    } = option;
    const isOfferSelected = offers ? offers.some((offer) => offer.id === id) : false;

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

const createEditPointTemplate = (point) => {
  const {
    basePrice,
    destination,
    type,
    offers,
    dateFrom,
    dateTo,
  } = point;
  const offersContainerClassName = offers.length !== 0 ? '' : ' visually-hidden';
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
                ${createEventTypesListTemplate()}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
            ${createDestinationTemplate(DESTINATION)}
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" "${basePrice}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
      <section class="event__section  event__section--offers ${offersContainerClassName}">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createOffersList(point)}
        </div>
      </section>
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
          </section>
        </section>
      </form>
    </li>`;
};

export default class EditPoint extends AbstractView {
  constructor(points) {
    super();
    this._points = points;

    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);
    this._editFormCloseHandler = this._editFormCloseHandler.bind(this);
  }

  getTemplate() {
    return createEditPointTemplate(this._points);
  }

  _editFormSubmitHandler(evt) {
    evt.preventDefault();
    this._callbacks.formSubmit(this._points);
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
}
