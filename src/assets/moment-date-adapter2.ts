import { DateAdapter, MatDateFormats, MAT_DATE_LOCALE } from '@angular/material';
import {  Moment } from 'moment';
import * as moment from 'moment';
import { Inject, Optional } from '@angular/core';

export const MOMENT_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
const dateNames: string[] = [];
for (let date = 1; date <= 31; date++) {
  dateNames.push(String(date));
}
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

export class MomentDateAdapter2 extends DateAdapter<Moment> {
  private _localeData: {
    firstDayOfWeek: number,
    longMonths: string[],
    shortMonths: string[],
    dates: string[],
    longDaysOfWeek: string[],
    shortDaysOfWeek: string[],
    narrowDaysOfWeek: string[]
  };
  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super();
    this.setLocale(dateLocale || moment.locale());
  }
  setLocale(locale: string) {
    super.setLocale(locale);
    let momentLocaleData = moment.localeData(locale);
    this._localeData = {
      firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
      longMonths: momentLocaleData.months(),
      shortMonths: momentLocaleData.monthsShort(),
      dates: range(31, (i) => this.createDate(2017, 0, i + 1).format('D')),
      longDaysOfWeek: momentLocaleData.weekdays(),
      shortDaysOfWeek: momentLocaleData.weekdaysShort(),
      narrowDaysOfWeek: momentLocaleData.weekdaysMin(),
    };
  }
  getYear(date: Moment): number {
    return this.clone(date).year();
  }
  getMonth(date: Moment): number {
    return this.clone(date).month();
  }
  getDate(date: Moment): number {
    return this.clone(date).date();
  }
  getDayOfWeek(date: Moment): number {
    return this.clone(date).day();
  }
  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    var result = (style == 'long' ? this._localeData.longMonths : this._localeData.shortMonths);
    return result;
  }
  getDateNames(): string[] {
    return this._localeData.dates;
  }
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style == 'long') {
      return this._localeData.longDaysOfWeek;
    }
    if (style == 'short') {
      return this._localeData.shortDaysOfWeek;
    }
    return this._localeData.narrowDaysOfWeek;
  }

  getYearName(date: Moment): string {
    return this.clone(date).add(543, 'years').format('YYYY');
  }

  getFirstDayOfWeek(): number {
    return this._localeData.firstDayOfWeek;
  }

  getNumDaysInMonth(date: Moment): number {
    return this.clone(date).daysInMonth();
  }

  clone(date: Moment): Moment {
    return date.clone().locale(this.locale);
  }

  createDate(year: number, month: number, date: number): Moment {
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }
    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }
    let result = moment({ year, month, date }).locale(this.locale);
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }
    return result;
  }
  today(): Moment {
    return moment().locale(this.locale);
  }
  parse(value: any, parseFormat: string | string[]): Moment | null {
    if (parseFormat == "DD/MM/YYYY") {
      value = value.substring(0, 6) + (parseInt(value.substring(6, 10)) - 543);
    }
    if (value && typeof value == 'string') {
      return moment(value, parseFormat, this.locale);
    }
    return value ? moment(value).locale(this.locale) : null;
  }
  format(date: Moment, displayFormat: string): string {
    date = this.clone(date);
    if (!this.isValid(date)) {
      throw Error('MomentDateAdapter: Cannot format invalid date.');
    }
    var out = date.format(displayFormat);
    if (displayFormat == "DD/MM/YYYY") {
      out = out.substring(0, 6) + (parseInt(out.substring(6, 10)) + 543);
    } else if (displayFormat == "LL") {
      var tmp = out.split(" ");
      out = tmp[0] + " " + tmp[1] + " " + (parseInt(tmp[2]) + 543)
    } else if (displayFormat == "MMM YYYY") {
      var tmp = out.split(" ");
      out = tmp[0] + " " + (parseInt(tmp[1]) + 543)
    }
    return out;
  }
  addCalendarYears(date: Moment, years: number): Moment {
    return this.clone(date).add({ years });
  }
  addCalendarMonths(date: Moment, months: number): Moment {
    return this.clone(date).add({ months });
  }
  addCalendarDays(date: Moment, days: number): Moment {
    return this.clone(date).add({ days });
  }
  toIso8601(date: Moment): string {
    return this.clone(date).format();
  }
  deserialize(value: any): Moment | null {
    let date;
    if (value instanceof Date) {
      date = moment(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      date = moment(value, moment.ISO_8601).locale(this.locale);
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
  }
  isDateInstance(obj: any): boolean {
    return moment.isMoment(obj);
  }
  isValid(date: Moment): boolean {
    return this.clone(date).isValid();
  }
  invalid(): Moment {
    return moment.invalid();
  }
}
