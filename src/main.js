import {createSiteMenuTemplate} from './view/site-menu.js';
import {createTripInfoTemplate} from './view/info.js';
import {createTripFilterTemplate} from './view/filter.js';
import {createTripSortTemplate} from './view/sort.js';
import {createAddNewPointTemplate} from './view/add-new-point.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {createPointTemplate} from './view/point.js';
import {createEventsListTemplate} from './view/event-list.js';
import {generateEvent} from './mock/task-mock';

const POINTS_COUNT = 15;
const point = new Array(POINTS_COUNT).fill().map(generateEvent);

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


render(tripControlsElement, createSiteMenuTemplate(), 'beforeend');
render(tripMainElement, createTripInfoTemplate(point), 'afterbegin');
render(tripFiltersElement, createTripFilterTemplate(), 'beforeend');
render(tripEventsElement, createTripSortTemplate(), 'beforeend');
render(tripEventsElement, createEventsListTemplate(), 'beforeend');

const eventsListElement = tripEventsElement.querySelector('.trip-events__list');

render(eventsListElement, createEditPointTemplate(point[0]), 'afterbegin');
render(eventsListElement, createAddNewPointTemplate(point[1]), 'beforeend');

for (let i=0; i < POINTS_COUNT; i++) {
  render(eventsListElement, createPointTemplate(point[i]), 'beforeend');
}

