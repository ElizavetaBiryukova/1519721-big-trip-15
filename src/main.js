import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/info.js';
import FilterView from './view/filter.js';
import TripSortView from './view/sort.js';
import EditPointView from './view/edit-point.js';
import PointView from './view/point.js';
import EventsListView from './view/event-list.js';
import {renderPoints} from './mock/task-mock';
import {render, RenderPosition} from './utils.js';

const Keys = { ESCAPE: 'Escape', ESC: 'Esc' };
const POINTS_COUNT = 15;
const points = renderPoints(POINTS_COUNT);

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

render(tripControlsElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(tripMainElement,  new TripInfoView(points).getElement(), RenderPosition.AFTERBEGIN);
render(tripFiltersElement, new FilterView().getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new TripSortView().getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new EventsListView().getElement(), RenderPosition.BEFOREEND);

const eventsListElement = tripEventsElement.querySelector('.trip-events__list');

const renderPoint = (pointsListElement, point) => {
  const pointComponent = new PointView(point).getElement();
  const pointEditComponent = new EditPointView(point).getElement();
  const eventButton = pointComponent.querySelector('.event__rollup-btn');
  const editForm = pointEditComponent.querySelector('form');
  const closeFormButton = pointEditComponent.querySelector('.event__rollup-btn');

  const replacePointToForm = () => {
    pointsListElement.replaceChild(pointEditComponent, pointComponent);
  };

  const replaceFormToPoint = () => {
    pointsListElement.replaceChild(pointComponent, pointEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === Keys.ESCAPE || evt.key === Keys.ESC) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventButton.addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  editForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  closeFormButton.addEventListener('click', () => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointsListElement, pointComponent, RenderPosition.BEFOREEND);
};

points.forEach((point) => {
  renderPoint(eventsListElement, point);
});

