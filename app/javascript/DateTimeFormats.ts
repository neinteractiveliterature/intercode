import { TFunction } from 'i18next';

// This sort of convoluted format is really here just so i18next-parser can do what it needs to do
// We don't want to actually import this file if possible; just use i18next along with the generated
// type below
const DateTimeFormatGenerators = {
  anytime: (t: TFunction) => t('dateTimeFormats.anytime'),
  compactDate: (t: TFunction) => t('dateTimeFormats.compactDate'),
  compactDateTime: (t: TFunction) => t('dateTimeFormats.compactDateTime'),
  compactWeekday: (t: TFunction) => t('dateTimeFormats.compactWeekday'),
  durationHoursMinutes: (t: TFunction) => t('dateTimeFormats.durationHoursMinutes'),
  indefinitely: (t: TFunction) => t('dateTimeFormats.indefinitely'),
  longDate: (t: TFunction) => t('dateTimeFormats.longDate'),
  longDateTime: (t: TFunction) => t('dateTimeFormats.longDateTime'),
  longDateTimeWithZone: (t: TFunction) => t('dateTimeFormats.longDateTimeWithZone'),
  longDayYear: (t: TFunction) => t('dateTimeFormats.longDayYear'),
  longMonthDay: (t: TFunction) => t('dateTimeFormats.longMonthDay'),
  longMonthYear: (t: TFunction) => t('dateTimeFormats.longMonthYear'),
  longWeekday: (t: TFunction) => t('dateTimeFormats.longWeekday'),
  longWeekdayDate: (t: TFunction) => t('dateTimeFormats.longWeekdayDate'),
  longWeekdayDateTimeWithZone: (t: TFunction) => t('dateTimeFormats.longWeekdayDateTimeWithZone'),
  longWeekdayTime: (t: TFunction) => t('dateTimeFormats.longWeekdayTime'),
  longWeekdayTimeWithZone: (t: TFunction) => t('dateTimeFormats.longWeekdayTimeWithZone'),
  midnight: (t: TFunction) => t('dateTimeFormats.midnight'),
  midnightWithZone: (t: TFunction) => t('dateTimeFormats.midnightWithZone'),
  noon: (t: TFunction) => t('dateTimeFormats.noon'),
  noonWithZone: (t: TFunction) => t('dateTimeFormats.noonWithZone'),
  shortDateTime: (t: TFunction) => t('dateTimeFormats.shortDateTime'),
  shortDateTimeWithZone: (t: TFunction) => t('dateTimeFormats.shortDateTimeWithZone'),
  shortHour: (t: TFunction) => t('dateTimeFormats.shortHour'),
  shortTime: (t: TFunction) => t('dateTimeFormats.shortTime'),
  shortTimeWithSeconds: (t: TFunction) => t('dateTimeFormats.shortTimeWithSeconds'),
  shortTimeWithZone: (t: TFunction) => t('dateTimeFormats.shortTimeWithZone'),
  shortWeekday: (t: TFunction) => t('dateTimeFormats.shortWeekday'),
  shortWeekdayDateTime: (t: TFunction) => t('dateTimeFormats.shortWeekdayDateTime'),
  shortWeekdayDateTimeWithZone: (t: TFunction) => t('dateTimeFormats.shortWeekdayDateTimeWithZone'),
  shortWeekdayTime: (t: TFunction) => t('dateTimeFormats.shortWeekdayTime'),
  shortWeekdayTimeWithZone: (t: TFunction) => t('dateTimeFormats.shortWeekdayTimeWithZone'),
  weekdayMidnight: (t: TFunction) => t('dateTimeFormats.weekdayMidnight'),
  weekdayMidnightWithZone: (t: TFunction) => t('dateTimeFormats.weekdayMidnightWithZone'),
  weekdayNoon: (t: TFunction) => t('dateTimeFormats.weekdayNoon'),
  weekdayNoonWithZone: (t: TFunction) => t('dateTimeFormats.weekdayNoonWithZone'),
  year: (t: TFunction) => t('dateTimeFormats.year'),
};

export type DateTimeFormatKey = keyof typeof DateTimeFormatGenerators;
