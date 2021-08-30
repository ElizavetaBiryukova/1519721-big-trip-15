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
import {
  sortByDate,
  sortByPrice,
  sortByTime
} from '../utils/point.js';
import {
  SortType
} from '../const.js';


export default class Events {
  constructor(pointsContainer) {
    this._pointsContainer = pointsContainer;
    this._pointPresenters = new Map();
    this._currentSortType = SortType.DAY;

    this._pointsComponent = new EventsListView();
    this._sortComponent = new TripSortView(this._currentSortType);
    this._noPointComponent = new NoPointView();

    this._changePointHandler = this._changePointHandler.bind(this);
    this._сhangeModeHandler = this._сhangeModeHandler.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
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

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this._points.sort(sortByDate);
        break;
      case SortType.PRICE:
        this._points.sort(sortByPrice);
        break;
      case SortType.TIME:
        this._points.sort(sortByTime);
        break;
    }
    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortPoints(sortType);
    this._clearPoints();
    this._renderEventsList();
  }

  _renderSort() {
    this._sortComponent = new TripSortView(this._currentSortType);
    render(this._pointsComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point, destinations) {
    const pointPresenter = new PointPresenter(this._pointsComponent, this._changePointHandler, this._сhangeModeHandler, this._destinations);
    pointPresenter.init(point, destinations);
    this._pointPresenters.set(point.id, pointPresenter);
  }

  _clearPoints() {
    this._pointPresenters.forEach((presenter) => presenter.destroy());
    this._pointPresenters.clear();
    remove(this._sortComponent);
  }

  _renderPoints() {
    this._points.forEach((point) => this._renderPoint(point));
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
