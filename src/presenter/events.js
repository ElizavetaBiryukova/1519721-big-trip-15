import EventsListView from '../view/event-list.js';
import NoPointView from '../view/no-point.js';
import TripSortView from '../view/sort.js';
import {
  render,
  RenderPosition,
  remove
} from '../utils/render.js';
// import {
//   updateItem
// } from '../utils/common.js';
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
  constructor(pointsContainer, pointsModel, destinationsModel) {
    this._pointsModel = pointsModel;
    this._destinationsModel = destinationsModel;

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

  init() {
    render(this._pointsContainer, this._pointsComponent, RenderPosition.BEFOREEND);

    this._renderEventsList();
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.DAY:
        return this._pointsModel.getPoints().slice().sort(sortByDate);
      case SortType.PRICE:
        return this._pointsModel.getPoints().slice().sort(sortByPrice);
      case SortType.TIME:
        return this._pointsModel.getPoints().slice().sort(sortByTime);
    }
    return this._pointsModel.getPoints();
  }

  _сhangeModeHandler() {
    this._pointPresenters.forEach((presenter) => presenter.resetView());
  }

  _changePointHandler(updatedPoint) {
    //Здесь будет вызов обновления модели
    this._pointPresenters.get(updatedPoint.id).init(updatedPoint);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
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
    this._getPoints().forEach((points) => {
      this._renderPoint(points, this._destinationsModel.getDestinations());
    });
  }

  _renderNoPoints() {
    render(this._pointsComponent, this._noEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEventsList() {
    if (this._getPoints.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPoints(this._pointsModel);
  }
}
