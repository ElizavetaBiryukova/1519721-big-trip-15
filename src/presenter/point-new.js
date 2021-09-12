import EditPointView from '../view/edit-point.js';
import { nanoid } from 'nanoid';
import { remove, render, RenderPosition } from '../utils/render.js';
import { UserAction, UpdateType, Keys } from '../const.js';

const BLANK_POINT = {
  type: 'taxi',
  offers: [],
  destination: {
    description: '',
    name: '',
    pictures: [],
  },
  dateFrom: new Date(),
  dateTo: new Date(),
  basePrice: '',
  isFavorite: false,
};

export default class PointNew {
  constructor(pointContainer, changeData, destinationsModel) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._destinationsModel = destinationsModel.getDestinations();

    this._pointNewComponent = null;

    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);
    this._editFormCloseHandler = this._editFormCloseHandler.bind(this);
    this._editFormDeleteClickHandler = this._editFormDeleteClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._pointNewComponent !== null) {
      return;
    }

    this._pointNewComponent = new EditPointView(BLANK_POINT, this._destinationsModel);
    this._pointNewComponent.setEditFormSubmitHandler(this._editFormSubmitHandler);
    this._pointNewComponent.setEditFormCloseHandler(this._editFormCloseHandler);
    this._pointNewComponent.setEditFormDeleteClickHandler(this._editFormDeleteClickHandler);

    render(this._pointContainer, this._pointNewComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointNewComponent === null) {
      return;
    }

    remove(this._pointNewComponent);
    this._pointNewComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _editFormSubmitHandler(points) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      // Пока у нас нет сервера, который бы после сохранения
      // выдывал честный id задачи, нам нужно позаботиться об этом самим
      Object.assign({id: nanoid()}, points),
    );
    this.destroy();
  }

  _editFormCloseHandler() {
    this.destroy();
  }

  _editFormDeleteClickHandler() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === Keys.ESCAPE || evt.key === Keys.ESC) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
