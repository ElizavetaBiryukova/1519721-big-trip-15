import { isEventExpired, isEventComing } from './point.js';
import { FilterType } from '../const.js';

export const pointsFilter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isEventExpired(point)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isEventComing(point)),
};

