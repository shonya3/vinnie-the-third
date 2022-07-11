import cronParser from 'cron-parser';

import type { Time, CronExpression, TimeUnit } from '../types.js';

export const secondsToMs = (num: number = 1) => 1000 * num;
export const minutesToMs = (num: number = 1) => secondsToMs(num) * 60;
export const hoursToMs = (num: number = 1) => minutesToMs(num) * 60;
export const daysToMs = (num: number = 1) => hoursToMs(num) * 24;
export const daysBefore = (date: Date, days: number) => new Date(date.getTime() - daysToMs(days));
export const minsBefore = (date: Date, mins: number) => new Date(date.getTime() - minutesToMs(mins));
export const minsLater = (date: Date, mins: number) => new Date(date.getTime() + minutesToMs(mins));

export const timeLeft = (date: Date) => {
  const now = new Date();
  if (date < now) return `Событие уже произошло`;
  const milliseconds = date.getTime() - now.getTime();
  const hour = Math.floor(milliseconds / hoursToMs());
  const minute = Math.floor((milliseconds / minutesToMs()) % 60);
  const hourString = hour > 0 ? `${hour}ч` : '';
  const minuteString = `${minute}мин`;
  return `Осталось ${hourString}${minuteString}`;
};

export const minutesLeft = (date: Date) => (date.getTime() - Date.now()) / minutesToMs();

export const toMs = ({ sec = 0, min = 0, hour = 0, day = 0 }: Time) => {
  `sec: ${sec}, min: ${min}, hour: ${hour}, day: ${day}`;
  return 1000 * sec + 1000 * 60 * min + 1000 * 60 * 60 * hour + 1000 * 60 * 60 * 24 * day;
};

export const waitMinutes = (minutes: number) => new Promise(r => setTimeout(r, minutesToMs(minutes)));
export const waitSeconds = (seconds: number) => new Promise(r => setTimeout(r, secondsToMs(seconds)));

export const relativeTimeFormat = (min: number, lang = 'ru') => {
  const unit = min > 60 ? 'hour' : 'minute';
  const val = unit === 'minute' ? min : Number((min / 60).toFixed(1));
  const rtf = new Intl.RelativeTimeFormat(lang, { style: 'narrow' });
  return rtf.format(val, unit);
};

export const cronToClosestDate = (expr: CronExpression) => cronParser.parseExpression(expr).next().toDate();
export const dateToRule = (date: Date, tz = 'Europe/Moscow') => ({
  minute: date.getMinutes(),
  hour: date.getHours(),
  dayOfWeek: date.getDay(),
  second: date.getSeconds(),
  tz,
});
export const timeString = (date: Date) => date.toLocaleTimeString('ru');

export const addMinutesToDate = (date: Date, minutes: number) => new Date(date.getTime() + 1000 * 60 * minutes);
export const addSecondsToDate = (date: Date, seconds: number) => new Date(date.getTime() + 1000 * seconds);
export const unitToMs = (value: number, from: TimeUnit) => {
  switch (from) {
    case 'milliseconds':
      return value;
    case 'seconds':
      return secondsToMs(value);
    case 'minutes':
      return minutesToMs(value);
    case 'hours':
      return hoursToMs(value);
    case 'days':
      return daysToMs(value);
  }
};
export const msToUnit = (value: number, to: TimeUnit) => {
  switch (to) {
    case 'milliseconds':
      return value;
    case 'seconds':
      return value / 1000;
    case 'minutes':
      return value / (1000 * 60);
    case 'hours':
      return value / (1000 * 60 * 60);
    case 'days':
      return value / (1000 * 60 * 60 * 24);
  }
};

export class TimeUnitConverter {
  #unit: TimeUnit;
  #value: number;
  constructor(value: number = 0, unit: TimeUnit = 'milliseconds') {
    this.#unit = unit;
    this.#value = value;
  }

  set unit(val: TimeUnit) {
    this.#unit = val;
  }
  get unit() {
    return this.#unit;
  }

  set value(val: number) {
    this.#value = val;
  }

  get value() {
    return this.#value;
  }

  c(val: number, unit?: TimeUnit) {
    this.value = val;
    if (unit) this.unit = unit;
    return this;
  }

  from(unit: TimeUnit) {
    if (this.unit !== unit) this.unit = unit;
    return this;
  }

  to(unit: TimeUnit) {
    const ms = unitToMs(this.value, this.unit);
    this.value = msToUnit(ms, unit);
    this.unit = unit;
    return this.value;
  }
}
