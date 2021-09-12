import EventsListView from '../view/event-list.js';
import NoPointView from '../view/no-point.js';
import TripSortView from '../view/sort.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import {sortByDate,sortByPrice,sortByTime} from '../utils/point.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import {pointsFilter} from '../utils/filter.js';


export default class Events {
  constructor(eventsContainer, pointsModel, filterModel, offersModel, destinationsModel) {
    this._eventsContainer = eventsContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._pointPresenters = new Map();
    this._currentSortType = SortType.DAY;

    this._sortComponent = null;
    this._eventsComponent = new EventsListView();
    this._noPointComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._eventsComponent, this._handleViewAction, this._destinationsModel);
  }

  init() {
    render(this._eventsContainer, this._eventsComponent, RenderPosition.BEFOREEND);

    this._renderEventsList();
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _getPoints() {
    this._filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = pointsFilter[this._filterType](points);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.DAY:
        return filteredPoints.sort(sortByDate);
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenters.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenters(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearEventsList();
        this._renderEventsList();
        break;
      case UpdateType.MAJOR:
        this._clearEventsList({resetSortType: true});
        this._renderEventsList();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearEventsList();
    this._renderEventsList();
  }

  _renderSort() {
    this._sortComponent = new TripSortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._eventsComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(points, destinations) {
    const pointPresenter = new PointPresenter(this._eventsComponent, this._handleViewAction, this._handleModeChange, this._destinations);
    pointPresenter.init(points, destinations);
    this._pointPresenters.set(points.id, pointPresenter);
  }

  _renderPoints() {
    this._getPoints().forEach((points) => {
      this._renderPoint(points, this._destinationsModel.getDestinations());
    });
  }

  _renderNoPoints() {
    this._noPointComponent = new NoPointView(this._filterType);
    render(this._eventsComponent, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEventsList() {
    if (this._getPoints().length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPoints(this._pointsModel);
  }

  _clearEventsList({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

    this._pointPresenters.forEach((presenter) => presenter.destroy());
    this._pointPresenters.clear();

    if (this._sortComponent !== null) {
      remove(this._sortComponent);
    }
    if (this._noPointComponent) {
      remove(this._noPointComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

}
