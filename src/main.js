import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/info.js';
import FilterView from './view/filter.js';
import {renderPoints} from './mock/point-mock';
import {render, RenderPosition} from './utils/render.js';
import EventsPresenter from './presenter/events.js';
import PointsModel from './model/points.js';
import DestinationsModel from './model/destinations.js';
import { destinations } from './mock/destination-mock.js';

const POINTS_COUNT =15;
const points = renderPoints(POINTS_COUNT);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(destinations);

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');


render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(tripFiltersElement, new FilterView(), RenderPosition.BEFOREEND);


const eventsPresenter = new EventsPresenter(tripEventsElement, pointsModel, destinationsModel);
eventsPresenter.init();
