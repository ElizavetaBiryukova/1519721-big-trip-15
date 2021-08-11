import dayjs from 'dayjs';
import {getRandomInteger, shuffleArray, getRandomArray} from '../utils';

const SENTENCE_COUNT = 5;
const MIN_PICTURE = 1;
const MAX_PICTURE = 5;
const MIN_PRICE = 10;
const MAX_PRICE = 10000;
const MIN_DAYS_GAP = -7;
const MAX_DAYS_GAP = 7;
export const TYPES = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const NAMES = ['Amsterdam', 'Chamonix', 'Geneva', 'Milan', 'New-York', 'Bangkok', 'Vienna'];
export const DESTINATION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];
const busOptions = [
  {
    id: 1,
    title: 'Add luggage',
    price: 10,
  },
  {
    id: 2,
    title: 'Choose seats',
    price: 5,
  },
  {
    id: 3,
    title: 'Book tickets',
    price: 20,
  },
];

const checkinOptions = [
  {
    id: 4,
    title: 'Add breakfast',
    price: 20,
  },
  {
    id: 5,
    title: 'Add dinner',
    price: 30,
  },
  {
    id: 6,
    title: 'Early check-in',
    price: 50,
  },
  {
    id: 7,
    title: 'Late check-out',
    price: 50,
  },
];

const driveOptions = [
  {
    id: 8,
    title: 'Rent a car',
    price: 200,
  },
  {
    id: 9,
    title: 'Rent a van',
    price: 500,
  },
];

const flightOptions = [
  {
    id: 10,
    title: 'Add luggage',
    price: 30,
  },
  {
    id: 11,
    title: 'Add meal',
    price: 20,
  },
  {
    id: 12,
    title: 'Choose seats',
    price: 10,
  },
  {
    id: 13,
    title: 'Switch to comfort class',
    price: 100,
  },
];

const restaurantOptions = [
  {
    id: 14,
    title: 'Book table 8-10am',
    price: 10,
  },
  {
    id: 15,
    title: 'Book table 5-6pm',
    price: 50,
  },
];

const shipOptions = [
  {
    id: 16,
    title: 'Add beverages',
    price: 20,
  },
  {
    id: 17,
    title: 'Add snacks',
    price: 20,
  },
  {
    id: 18,
    title: 'Choose cabin',
    price: 100,
  },
];

const sightseeingOptions = [
  {
    id: 19,
    title: 'Book tickets',
    price: 50,
  },
  {
    id: 20,
    title: 'Lunch in city',
    price: 30,
  },
];

const taxiOptions = [
  {
    id: 21,
    title: 'Order Uber',
    price: 20,
  },
  {
    id: 22,
    title: 'Choose the radio station',
    price: 10,
  },
  {
    id: 23,
    title: 'Upgrade to a business class',
    price: 100,
  },
];

const trainOptions = [
  {
    id: 24,
    title: 'Add meal',
    price: 20,
  },
  {
    id: 25,
    title: 'Choose seats',
    price: 100,
  },
];

const transportOptions = [
  {
    id: 26,
    title: 'Buy day pass',
    price: 10,
  },
  {
    id: 27,
    title: 'Buy week pass',
    price: 25,
  },
  {
    id: 28,
    title: 'Buy month pass',
    price: 50,
  },
];

export const optionsMap = new Map();
optionsMap.set('bus', busOptions);
optionsMap.set('check-in', checkinOptions);
optionsMap.set('drive', driveOptions);
optionsMap.set('flight', flightOptions);
optionsMap.set('sightseeing', sightseeingOptions);
optionsMap.set('ship', shipOptions);
optionsMap.set('restaurant', restaurantOptions);
optionsMap.set('taxi', taxiOptions);
optionsMap.set('train', trainOptions);
optionsMap .set('transport', transportOptions);

//Тип точек маршрута
const generateTypes = () => (
  TYPES[getRandomInteger(0, TYPES.length - 1)]
);

//Пункты назначения (города)
const generateNames = () => (
  NAMES[getRandomInteger(0, NAMES.length - 1)]
);

//Описание. От 1 до 5 случайных предложений из текста
const generateDescription = (content) => {
  const descriptions = shuffleArray(content).slice(0, SENTENCE_COUNT).join('');
  return descriptions;
};

//Фото
const generatePicture = () => ({
  src: `http://picsum.photos/248/152?r=${Math.random()}`,
  description: DESTINATION[getRandomInteger(0, DESTINATION.length - 1)],
});

const getPictures = () => {
  const pictures = new Array(getRandomInteger(MIN_PICTURE, MAX_PICTURE)).fill().map(() => generatePicture());
  return pictures;
};

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
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom: firstRandomDate < secondRandomDate ? firstRandomDate : secondRandomDate,
    dateTo: firstRandomDate < secondRandomDate ? secondRandomDate : firstRandomDate,
    destination: {
      name: generateNames(),
      description: generateDescription(DESTINATION),
      pictures: getPictures(),
    },
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: getRandomArray(optionsMap.get(type)),
    type,
  };
};

export const renderPoints = (count) => {
  const points = new Array(count).fill().map(generateEvent).sort((a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom));

  return points;
};
