import { humanizeFullDate, humanizeDuration, humanizeDate, humanizeTime } from '../utils/point.js';
import AbstractView from './abstract.js';

const createOffersTemplate = (offers) => {
  let optionsMarkup = '';
  offers.forEach((offer) => {
    optionsMarkup += `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`;
  });
  return optionsMarkup;
};

const createPointTemplate = (point) => {
  const {dateFrom, dateTo, destination, offers, type, basePrice} = point;
  const favoriteButtonClasses = point.isFavorite ? 'event__favorite-btn event__favorite-btn--active' : 'event__favorite-btn';
  const duration = humanizeDuration(point.dateFrom, point.dateTo);
  const optionsMarkup = createOffersTemplate(offers);
  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${humanizeFullDate(dateFrom)}">${humanizeDate(dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${humanizeFullDate(dateFrom)}T${humanizeTime(dateFrom)}">${humanizeTime(dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${humanizeFullDate(dateTo)}T${humanizeTime(dateTo)}">${humanizeTime(dateTo)}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <ul class="event__selected-offers">
        ${optionsMarkup}
      </ul>
      <button class="${favoriteButtonClasses}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
};

export default class Point extends AbstractView {
  constructor(points) {
    super();
    this._points = points;

    this._pointEditClickHandler = this._pointEditClickHandler.bind(this);
    this._favouriteClickHandler = this._favouriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._points);
  }

  _favouriteClickHandler(evt) {
    evt.preventDefault();
    this._callbacks.favouriteClick();
  }

  setFavouriteClickHandler(callback) {
    this._callbacks.favouriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favouriteClickHandler);
  }

  _pointEditClickHandler(evt) {
    evt.preventDefault();
    this._callbacks.editClick();
  }

  setPointEditClickHandler(callback) {
    this._callbacks.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._pointEditClickHandler);
  }
}
