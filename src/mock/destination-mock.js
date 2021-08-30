import {getRandomInteger, shuffleArray } from '../utils/common.js';
import {NAMES, SENTENCE_COUNT, DESTINATION, MIN_PICTURE, MAX_PICTURE} from '../const.js';

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

export const generateDestination = () => {
  const pictures = getPictures();

  const destination = {
    name: generateNames(),
    description: generateDescription(DESTINATION),
    pictures: pictures,
  };
  return destination;
};

const renderDestinations = () => new Array(SENTENCE_COUNT).fill(null).map(generateDestination);
export const destinations = renderDestinations();

