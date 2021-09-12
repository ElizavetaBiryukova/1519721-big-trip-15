import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/info.js';
import FilterPresenter from './presenter/filter.js';
import EventsPresenter from './presenter/events.js';
import {renderPoints} from './mock/point-mock';
import {render, RenderPosition} from './utils/render.js';
import PointsModel from './model/points.js';
import DestinationsModel from './model/destinations.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import { destinations } from './mock/destination-mock.js';
import { UpdateType, POINTS_COUNT } from './const.js';


const points = renderPoints(POINTS_COUNT, destinations);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(UpdateType.PATCH, destinations);

const filterModel = new FilterModel();
const offersModel = new OffersModel();

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');


render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new SiteMenuView(), RenderPosition.AFTERBEGIN);

const eventsPresenter = new EventsPresenter(tripEventsElement, pointsModel, filterModel, offersModel, destinationsModel);
const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, pointsModel);

filterPresenter.init();
eventsPresenter.init();

siteHeaderElement.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  eventsPresenter.createPoint();
});

