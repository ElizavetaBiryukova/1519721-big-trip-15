import dayjs from 'dayjs';
import {getRandomInteger, getRandomArray} from '../utils/common.js';
import {sortByDate, getDateTo} from '../utils/point';
import {nanoid} from 'nanoid';
import {TYPES, MIN_DAYS_GAP, MAX_DAYS_GAP, MIN_PRICE, MAX_PRICE, optionsMap} from '../const.js';

//Тип точек маршрута
const generateTypes = () => (
  TYPES[getRandomInteger(0, TYPES.length - 1)]
);

//Дата
const getRandomDate = () => {
  const minutes = getRandomInteger(1, 60);
  const hours = getRandomInteger(1, 24);
  const daysGap = getRandomInteger(MIN_DAYS_GAP, MAX_DAYS_GAP);
  return dayjs()
    .add(daysGap, 'day')
    .add(minutes, 'm')
    .add(hours, 'hour')
    .toDate();
};

export const generateEvent = (destination) => {
  const dateFrom = getRandomDate(dayjs().add(-20, 'd'), dayjs().add(6, 'M'));
  const type = generateTypes();

  return {
    id: nanoid(),
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom,
    dateTo: getDateTo(dateFrom),
    destination,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: getRandomArray(optionsMap.get(type)),
    type,
  };
};

export const renderPoints = (count, destinations) => {
  const points = new Array(count).fill().
    map(() => (generateEvent(destinations[getRandomInteger(0, destinations.length - 1)])))
    .sort(sortByDate);

  return points;
};
