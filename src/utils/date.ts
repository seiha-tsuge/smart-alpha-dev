import dayjs from '@/lib/dayjs';

import type { ConfigType } from '@/lib/dayjs';

export function getCurrentDate(format = 'YYYY/MM/DD'): string {
  return dayjs().format(format);
}

export function addDaysToDate(date: ConfigType, days: number): Date {
  return dayjs(date).add(days, 'day').toDate();
}

export function subtractDaysFromDate(date: ConfigType, days: number): Date {
  return dayjs(date).subtract(days, 'day').toDate();
}

export function subtractMinuteFromDate(date: ConfigType, minute: number): Date {
  return dayjs(date).subtract(minute, 'm').toDate();
}

export function isAfterDate(date: ConfigType, dateToCompare: ConfigType): boolean {
  return dayjs(date).isAfter(dateToCompare);
}
