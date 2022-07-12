import cronParser from 'cron-parser';

import type { Time, CronExpression, TimeUnit } from '../types.js';

export const secondsToMs = (num: number = 1) => 1000 * num;
export const minutesToMs = (num: number = 1) => secondsToMs(num) * 60;
export const hoursToMs = (num: number = 1) => minutesToMs(num) * 60;
export const daysToMs = (num: number = 1) => hoursToMs(num) * 24;
export const daysBefore = (date: Date, days: number) => new Date(date.getTime() - daysToMs(days));
export const minsBefore = (date: Date, mins: number) => new Date(date.getTime() - minutesToMs(mins));
export const minsLater = (date: Date, mins: number) => new Date(date.getTime() + minutesToMs(mins));
export const secondsLater = (date: Date, seconds: number) => new Date(date.getTime() + 1000 * seconds);

export const timeLeft = (date: Date) => {
  const now = new Date();
  if (date < now) return `Событие уже произошло`;
  const milliseconds = date.getTime() - now.getTime();
  const hour = Math.floor(milliseconds / hoursToMs());
  const minute = Math.ceil((milliseconds / minutesToMs()) % 60);
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

export const cronToClosestDate = (expr: CronExpression) => cronParser.parseExpression(expr).next().toDate();
export const dateToRule = (date: Date, tz = 'Europe/Moscow') => ({
  minute: date.getMinutes(),
  hour: date.getHours(),
  dayOfWeek: date.getDay(),
  second: date.getSeconds(),
  tz,
});
export const timeString = (date: Date, locale = 'ru') => date.toLocaleTimeString(locale);

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

  from(unit: TimeUnit) {
    this.unit = unit;
    return this;
  }

  to(unit: TimeUnit) {
    const ms = unitToMs(this.value, this.unit);
    this.value = msToUnit(ms, unit);
    this.unit = unit;
    return this.value;
  }
}

if (import.meta.vitest) {
  const { it, expect, describe, vi } = import.meta.vitest;
  const now = new Date();
  const testDate = new Date(2022, 6, 11, 19, 10);

  it('secondsToMs', () => {
    expect(secondsToMs(5)).toBe(5 * 1000);
    expect(secondsToMs(0)).toBe(0);
  });
  it('minutesToMs', () => {
    expect(minutesToMs(5)).toBe(1000 * 60 * 5);
  });
  it('hoursToMs', () => {
    expect(hoursToMs(1)).toBe(1000 * 60 * 60);
  });
  it('daysToMs', () => {
    expect(daysToMs(100)).toBe(100 * 24 * 1000 * 60 * 60);
  });
  it('daysBefore', () => {
    expect(now.getTime() - daysBefore(now, 5).getTime()).toBe(432000000);
    expect(now.getTime() - daysBefore(now, 0).getTime()).toBe(0);
  });
  it('minsBefore', () => {
    expect(now.getTime() - minsBefore(now, 5).getTime()).toBe(5 * 60 * 1000);
  });
  it('minsLater', () => {
    expect(minsLater(now, 1).getTime() - now.getTime()).toBe(1000 * 60);
  });
  it('secondsLater', () => {
    expect(secondsLater(now, 1).getTime() - now.getTime()).toBe(1000);
  });
  describe('timeLeft', () => {
    it('checks if date refers to past', () => {
      const before = new Date(now.getTime() - 1);
      expect(timeLeft(before)).toBe('Событие уже произошло');
    });
    it('should return a ready-to-use formatted string with time left', () => {
      const date = minsLater(now, 90);
      const dayLater = minsLater(now, 60 * 24 + 30);
      expect(timeLeft(date)).toBe('Осталось 1ч30мин');
      expect(timeLeft(dayLater)).toBe('Осталось 24ч30мин');
    });
  });
  it('minutesLeft', () => {
    const tenMinsLater = minsLater(now, 10);
    expect(Math.ceil(minutesLeft(tenMinsLater))).toBe(10);
  });
  it('toMs', () => {
    expect(toMs({ sec: 50, min: 90, hour: 1 })).toBe(9050000);
    expect(toMs({})).toBe(0);
  });
  it('cronToClosestDate', () => {
    vi.useFakeTimers();
    vi.setSystemTime(testDate);
    const cron = '0 23 * * 2';
    const date = cronToClosestDate(cron);
    const dayOfMonth = date.getDate();
    const hour = date.getHours();
    expect(dayOfMonth).toBe(12);
    expect(hour).toBe(23);

    vi.useRealTimers();
  });
  it('timeString', () => {
    expect(timeString(testDate)).toBe('19:10:00');
  });
  it('dateToRule', () => {
    expect(dateToRule(testDate, 'Europe/Moscow')).toEqual({
      minute: 10,
      hour: 19,
      dayOfWeek: 1,
      tz: 'Europe/Moscow',
      second: 0,
    });
  });
  it('unitToMs', () => {
    expect(unitToMs(10, 'milliseconds')).toBe(10);
    expect(unitToMs(10, 'seconds')).toBe(10 * 1000);
    expect(unitToMs(10, 'minutes')).toBe(10 * 1000 * 60);
    expect(unitToMs(10, 'hours')).toBe(10 * 1000 * 60 * 60);
    expect(unitToMs(10, 'days')).toBe(10 * 1000 * 60 * 60 * 24);
  });
  it('msToUnit', () => {
    const v = 3_600_000;
    expect(msToUnit(v, 'milliseconds')).toBe(3_600_000);
    expect(msToUnit(v, 'seconds')).toBe(3_600);
    expect(msToUnit(v, 'minutes')).toBe(60);
    expect(msToUnit(v, 'hours')).toBe(1);
    expect(msToUnit(v, 'days')).toBe(1 / 24);
  });
  describe('TimeUnitConverter', () => {
    it('works correctly', () => expect(new TimeUnitConverter(10, 'minutes').to('seconds')).toBe(600));
    it('defaults to milliseconds', () => expect(new TimeUnitConverter(1000).to('seconds')).toBe(1));
    it('from - to', () => expect(new TimeUnitConverter(3600).from('seconds').to('hours')).toBe(1));
  });
}
