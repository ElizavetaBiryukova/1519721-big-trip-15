import EventsListView from '../view/event-list.js';
import NoPointView from '../view/no-point.js';
import TripSortView from '../view/sort.js';
import {
  render,
  RenderPosition,
  remove
} from '../utils/render.js';
import {
  updateItem
} from '../utils/common.js';
import PointPresenter from '../presenter/point.js';


export default class Events {
  constructor(pointsContainer) {
    this._pointsContainer = pointsContainer;
    this._pointPresenters = new Map();

    this._pointsComponent = new EventsListView();
    this._sortComponent = new TripSortView();
    this._noPointComponent = new NoPointView();

    this._changePointHandler = this._changePointHandler.bind(this);
    this._сhangeModeHandler = this._сhangeModeHandler.bind(this);
  }

  init(points) {
    this._points = points.slice();

    render(this._pointsContainer, this._pointsComponent, RenderPosition.BEFOREEND);

    this._renderEventsList();
  }

  _сhangeModeHandler() {
    this._pointPresenters.forEach((presenter) => presenter.resetView());
  }

  _changePointHandler(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenters.get(updatedPoint.id).init(updatedPoint);
  }

  _renderSort() {
    render(this._pointsComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsComponent, this._changePointHandler, this._сhangeModeHandler);
    pointPresenter.init(point);
    this._pointPresenters.set(point.id, pointPresenter);
  }

  _clearPoints() {
    this._pointPresenters.forEach((presenter) => presenter.destroy());
    this._pointPresenters.clear();
    remove(this._sortComponent);
  }

  _renderPoints() {
    this._points
      .slice()
      .forEach((point) => this._renderPoint(point));
  }

  _renderNoPoints() {
    render(this._pointsComponent, this._noEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEventsList() {
    if (this._points.length === 0) {
      this._renderNoPoints();
    }

    this._renderSort();
    this._renderPoints();
  }
}
