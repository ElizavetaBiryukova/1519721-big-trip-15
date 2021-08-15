import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/info.js';
import FilterView from './view/filter.js';
import TripSortView from './view/sort.js';
import EditPointView from './view/edit-point.js';
import PointView from './view/point.js';
import EventsListView from './view/event-list.js';
import NoPointView from './view/no-point.js';
import {renderPoints} from './mock/task-mock';
import {render, RenderPosition, replace} from './utils/render.js';

const Keys = { ESCAPE: 'Escape', ESC: 'Esc' };
const POINTS_COUNT = 15;

const points = renderPoints(POINTS_COUNT);

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');


render(tripEventsElement, new EventsListView(), RenderPosition.BEFOREEND);

const eventsListElement = tripEventsElement.querySelector('.trip-events__list');

const renderPoint = (pointsListElement, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new EditPointView(point);

  const replacePointToForm = () => {
    replace(pointEditComponent, pointComponent);
  };

  const replaceFormToPoint = () => {
    replace(pointComponent, pointEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === Keys.ESCAPE || evt.key === Keys.ESC) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.setPointClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.setEditFormSubmitHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.setEditFormCloseHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointsListElement, pointComponent, RenderPosition.BEFOREEND);
};

const renderEventsListElement = (pointsContainer, pointsElement) => {
  if (points.length === 0) {
    render(pointsContainer, new NoPointView(), RenderPosition.BEFOREEND);
  }
  render(tripMainElement,  new TripInfoView(points), RenderPosition.AFTERBEGIN);
  render(tripEventsElement, new TripSortView(), RenderPosition.BEFOREEND);

  pointsElement.forEach((pointElement) => {
    renderPoint(pointsContainer, pointElement);
  });
};

render(tripControlsElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(tripFiltersElement, new FilterView(), RenderPosition.BEFOREEND);

renderEventsListElement(eventsListElement, points);
