import dayjs from 'dayjs';
// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

//перемешивает массив
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Рандомно добавляет элементы в массив
export const getRandomArray = (arr) => (
  arr.filter(() => Math.random() > 0.5)
);

const isEventComing = (point) => {
  const today = dayjs();
  return (today.isAfter(dayjs(point.dateFrom), 'd') || today.isSame(dayjs(point.dateFrom), 'd'));
};

const isEventExpired = (point) => {
  const today = dayjs();
  return today.isBefore(dayjs(point.dateFrom), 'd');
};

const humanizeFullDateAndTime = (date) => (
  dayjs(date).format('DD/MM/YY HH:MM')
);

const humanizeFullDate = (date) => (
  dayjs(date).format('YYYY-MM-DD')
);

const humanizeDate = (date) => (
  dayjs(date).format('MMM D')
);

const humanizeTime = (date) => (
  dayjs(date).format('HH:MM')
);

const humanizeDay = (date) => (
  dayjs(date).format('DD')
);

const humanizeDuration = (dateFrom, dateTo) => {
  const milliseconds = dayjs(dateTo).diff(dayjs(dateFrom));
  let minutes = parseInt((milliseconds / (1000 * 60) % 60), 10);
  let hours = parseInt((milliseconds / (1000 * 60 * 60) % 24), 10);
  let days = parseInt((milliseconds / (1000 * 60 * 60 * 24)), 10);
  const nullString = '0';

  days = (days < 10) ? nullString + days : days;
  hours = (hours < 10) ? nullString + hours : hours;
  minutes = (minutes < 10) ? nullString + minutes : minutes;

  if (days === 0 || days === '00') {
    return `${hours}H ${minutes}M`;
  }
  if ((days === 0 || days === '00') && (hours === 0 || hours === '00')) {
    return `${minutes}M`;
  }

  return `${days}D ${hours}H ${minutes}M`;
};

const getEventPeriod = (startingPoint, endingPoint) => {
  const monthStart = dayjs(startingPoint.dateFrom).month();
  const monthEnd = dayjs(endingPoint.dateTo).month();
  if (monthStart === monthEnd) {
    return `${humanizeDate(startingPoint.dateFrom)}&nbsp;&mdash;&nbsp;${humanizeDay(endingPoint.dateTo)}`;
  }
  return `${humanizeDate(startingPoint.dateFrom)}&nbsp;&mdash;&nbsp;${humanizeDate(endingPoint.dateTo)}`;
};

export {
  humanizeDuration,
  isEventComing,
  isEventExpired,
  humanizeFullDateAndTime,
  humanizeFullDate,
  humanizeDate,
  humanizeTime,
  humanizeDay,
  getEventPeriod
};
