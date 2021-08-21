import dayjs from 'dayjs';

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

export const sortByDate = (pointA, pointB) => dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);

export const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortByTime = (pointA, pointB) => (dayjs(pointB.dateTo) - dayjs(pointB.dateFrom)) - (dayjs(pointA.dateTo) - dayjs(pointA.dateFrom));

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
