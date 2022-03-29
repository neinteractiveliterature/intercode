import { TFunction } from 'i18next';

// This sort of convoluted format is really here just so i18next-parser can do what it needs to do
// We don't want to actually import this file if possible; just use i18next along with the generated
// type below
const DateTimeFormatGenerators = {
  anytime: (t: TFunction) => t('dateTimeFormats.anytime', "'anytime'"),
  compactDate: (t: TFunction) => t('dateTimeFormats.compactDate', 'yyyy-MM-dd'),
  compactDateTime: (t: TFunction) => t('dateTimeFormats.compactDateTime', 'yyyy-MM-dd HH:mm'),
  durationHoursMinutes: (t: TFunction) => t('dateTimeFormats.durationHoursMinutes', 'h:mm'),
  indefinitely: (t: TFunction) => t('dateTimeFormats.indefinitely', "'indefinitely'"),
  longDate: (t: TFunction) => t('dateTimeFormats.longDate', 'MMMM d, yyyy'),
  longDateTime: (t: TFunction) => t('dateTimeFormats.longDateTime', "MMMM d, yyyy 'at' h:mmaaa"),
  longDateTimeWithZone: (t: TFunction) => t('dateTimeFormats.longDateTimeWithZone', "MMMM d, yyyy 'at' h:mmaaa ZZZZ"),
  longDayYear: (t: TFunction) => t('dateTimeFormats.longDayYear', 'd, yyyy'),
  longMonthDay: (t: TFunction) => t('dateTimeFormats.longMonthDay', 'MMMM d'),
  longMonthYear: (t: TFunction) => t('dateTimeFormats.longMonthYear', 'MMMM yyyy'),
  longWeekday: (t: TFunction) => t('dateTimeFormats.longWeekday', 'cccc'),
  longWeekdayDate: (t: TFunction) => t('dateTimeFormats.longWeekdayDate', 'cccc, MMMM d, yyyy'),
  longWeekdayDateTimeWithZone: (t: TFunction) =>
    t('dateTimeFormats.longWeekdayDateTimeWithZone', "cccc, MMMM d, yyyy 'at' h:mmaaa ZZZZ"),
  longWeekdayTime: (t: TFunction) => t('dateTimeFormats.longWeekdayTime', 'cccc h:mmaaa'),
  longWeekdayTimeWithZone: (t: TFunction) => t('dateTimeFormats.longWeekdayTimeWithZone', 'cccc h:mmaaa ZZZZ'),
  midnight: (t: TFunction) => t('dateTimeFormats.midnight', "'midnight'"),
  midnightWithZone: (t: TFunction) => t('dateTimeFormats.midnightWithZone', "'midnight' ZZZZ"),
  noon: (t: TFunction) => t('dateTimeFormats.noon', "'noon'"),
  noonWithZone: (t: TFunction) => t('dateTimeFormats.noonWithZone', "'noon' ZZZZ"),
  shortDateTime: (t: TFunction) => t('dateTimeFormats.shortDateTime', 'MMM d, yyyy h:mmaaa'),
  shortDateTimeWithZone: (t: TFunction) => t('dateTimeFormats.shortDateTimeWithZone', 'MMM d, yyyy h:mmaaa ZZZZ'),
  shortHour: (t: TFunction) => t('dateTimeFormats.shortHour', 'haaa'),
  shortTime: (t: TFunction) => t('dateTimeFormats.shortTime', 'h:mmaaa'),
  shortTimeWithSeconds: (t: TFunction) => t('dateTimeFormats.shortTimeWithSeconds', 'h:mm:ssaaa'),
  shortTimeWithZone: (t: TFunction) => t('dateTimeFormats.shortTimeWithZone', 'h:mmaaa ZZZZ'),
  shortWeekday: (t: TFunction) => t('dateTimeFormats.shortWeekday', 'ccc'),
  shortWeekdayDateTime: (t: TFunction) => t('dateTimeFormats.shortWeekdayDateTime', 'ccc, MMM d, yyyy h:mmaaa'),
  shortWeekdayTime: (t: TFunction) => t('dateTimeFormats.shortWeekdayTime', 'ccc h:mmaaa'),
  shortWeekdayTimeWithZone: (t: TFunction) => t('dateTimeFormats.shortWeekdayTimeWithZone', 'ccc h:mmaaa ZZZZ'),
  weekdayMidnight: (t: TFunction) => t('dateTimeFormats.weekdayMidnight', "ccc 'midnight'"),
  weekdayMidnightWithZone: (t: TFunction) => t('dateTimeFormats.weekdayMidnightWithZone', "ccc 'midnight' ZZZZ"),
  weekdayNoon: (t: TFunction) => t('dateTimeFormats.weekdayNoon', "ccc 'noon'"),
  weekdayNoonWithZone: (t: TFunction) => t('dateTimeFormats.weekdayNoonWithZone', "ccc 'noon' ZZZZ"),
  year: (t: TFunction) => t('dateTimeFormats.year', 'yyyy'),
};

export type DateTimeFormatKey = keyof typeof DateTimeFormatGenerators;
