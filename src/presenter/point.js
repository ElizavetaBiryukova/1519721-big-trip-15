import { render, RenderPosition, replace, remove } from '../utils/render.js';
import EditPointView from '../view/edit-point';
import PointView from '../view/point.js';
import {UserAction, UpdateType, Keys} from '../const.js';
import { isDatesEqual } from '../utils/point.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handlePointEditClick = this._handlePointEditClick.bind(this);
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._handleEditFormClose = this._handleEditFormClose.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(points, destinations) {
    this._points = points;
    this._destinations = destinations;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(points);
    this._pointEditComponent = new EditPointView(points, destinations);

    this._pointComponent.setPointEditClickHandler(this._handlePointEditClick);
    this._pointComponent.setFavouriteClickHandler(this._handleFavouriteClick);
    this._pointEditComponent.setEditFormSubmitHandler(this._handleEditFormSubmit);
    this._pointEditComponent.setEditFormCloseHandler(this._handleEditFormClose);
    this._pointEditComponent.setEditFormDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === Keys.ESCAPE || evt.key === Keys.ESC) {
      evt.preventDefault();
      this._pointEditComponent.reset(this._points);
      this._replaceFormToPoint();
    }
  }

  _handlePointEditClick() {
    this._replacePointToForm();
  }

  _handleFavouriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._points,
        {
          isFavorite: !this._points.isFavorite,
        },
      ),
    );
  }

  _handleEditFormSubmit(update) {
    const isMinorUpdate =
    !isDatesEqual(this._points.dateFrom, update.dateFrom) ||
    this._points.basePrice !== update.basePrice;

    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this._replaceFormToPoint();
  }

  _handleEditFormClose() {
    this._pointEditComponent.reset(this._points);
    this._replaceFormToPoint();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleDeleteClick(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}
