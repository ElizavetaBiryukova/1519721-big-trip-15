import {
  getEventPeriod
} from '../utils/point.js';
import AbstractView from './abstract.js';

const MIN_TITLE_LENGTH = 2;

const removeDuplPointsNames = (points) => {
  const unduplicatedPointsNames = [points[0].destination.name];
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i].destination.name;
    const next = points[i + 1].destination.name;
    if (next !== current) {
      unduplicatedPointsNames.push(next);
    }
  }
  return unduplicatedPointsNames;
};

const getRoutePointsTitle = (points) => {
  const routeTitle = removeDuplPointsNames(points);
  const lastPoint = routeTitle.slice([routeTitle.length - 1]);
  if (routeTitle.length > MIN_TITLE_LENGTH) {
    return `${routeTitle.slice(0, MIN_TITLE_LENGTH - 1).join(' &mdash; ')}
       &mdash; . . . &mdash; ${lastPoint.join(' &mdash; ')}`;
  }
  return routeTitle.join(' &mdash; ');
};

const createTripInfoTemplate = (points) => {

  const sumValues = (accumulator, currentValue) => (
    accumulator + currentValue
  );

  let totalPrice = 0;
  points.forEach((point) => {
    totalPrice = totalPrice + point.offers.map((offer) => offer.price).reduce(sumValues, point.basePrice);
  });
  return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getRoutePointsTitle(points)}</h1>
        <p class="trip-info__dates">${getEventPeriod(points[0], points[points.length - 1])}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`;
};

export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }
}
