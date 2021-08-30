import dayjs from 'dayjs';
import {getRandomInteger, getRandomArray} from '../utils/common.js';
import {sortByDate} from '../utils/point';
import {nanoid} from 'nanoid';
import { generateDestination } from './destination-mock.js';
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

export const generateEvent = () => {
  const firstRandomDate = getRandomDate();
  const secondRandomDate = getRandomDate();
  const type = generateTypes();

  return {
    id: nanoid(),
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom: firstRandomDate < secondRandomDate ? firstRandomDate : secondRandomDate,
    dateTo: firstRandomDate < secondRandomDate ? secondRandomDate : firstRandomDate,
    destination: generateDestination(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: getRandomArray(optionsMap.get(type)),
    type,
  };
};

export const renderPoints = (count) => {
  const points = new Array(count).fill().map(generateEvent).sort(sortByDate);

  return points;
};
