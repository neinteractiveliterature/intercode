import { TFunction } from 'i18next';

// This sort of convoluted format is really here just so i18next-parser can do what it needs to do
// We don't want to actually import this file if possible; just use i18next along with the generated
// type below
const DateTimeFormatGenerators = {
  anytime: (t: TFunction) => t('dateTimeFormats.anytime', "'anytime'"),
  compactDateTime: (t: TFunction) => t('dateTimeFormats.compactDateTime', 'yyyy-MM-dd HH:mm'),
  durationHoursMinutes: (t: TFunction) => t('dateTimeFormats.durationHoursMinutes', 'h:mm'),
  indefinitely: (t: TFunction) => t('dateTimeFormats.indefinitely', "'indefinitely'"),
  longDate: (t: TFunction) => t('dateTimeFormats.longDate', 'MMMM D, yyyy'),
  longDateTime: (t: TFunction) => t('dateTimeFormats.longDateTime', "MMMM d, yyyy 'at' h:mmaaa"),
  longDayYear: (t: TFunction) => t('dateTimeFormats.longDayYear', 'D, yyyy'),
  longMonthDay: (t: TFunction) => t('dateTimeFormats.longMonthDay', 'MMMM D'),
  longMonthYear: (t: TFunction) => t('dateTimeFormats.longMonthDay', 'MMMM yyyy'),
  longWeekday: (t: TFunction) => t('dateTimeFormats.longWeekday', 'cccc'),
  longWeekdayDate: (t: TFunction) => t('dateTimeFormats.longWeekdayDate', 'cccc, MMMM d, yyyy'),
  longWeekdayDateTime: (t: TFunction) =>
    t('dateTimeFormats.longWeekdayDateTime', "cccc, MMMM d, yyyy 'at' h:mmaaa"),
  longWeekdayDateTimeWithZone: (t: TFunction) =>
    t('dateTimeFormats.longWeekdayDateTimeWithZone', "cccc, MMMM d, yyyy 'at' h:mmaaa ZZZZ"),
  longWeekdayTime: (t: TFunction) => t('dateTimeFormats.longWeekdayTime', 'cccc h:mmaaa'),
  midnight: (t: TFunction) => t('dateTimeFormats.midnight', "'midnight'"),
  noon: (t: TFunction) => t('dateTimeFormats.noon', "'noon'"),
  shortDateTime: (t: TFunction) => t('dateTimeFormats.shortDateTime', 'MMM d, yyyy h:mmaaa'),
  shortDateTimeWithZone: (t: TFunction) =>
    t('dateTimeFormats.shortDateTimeWithZone', 'h:mmaaa ZZZZ'),
  shortHour: (t: TFunction) => t('dateTimeFormats.shortHour', 'haaa'),
  shortTime: (t: TFunction) => t('dateTimeFormats.shortTime', 'h:mmaaa'),
  shortTimeWithSeconds: (t: TFunction) => t('dateTimeFormats.shortTimeWithSeconds', 'h:mm:ssaaa'),
  shortWeekday: (t: TFunction) => t('dateTimeFormats.shortWeekday', 'ccc'),
  shortWeekdayDateTime: (t: TFunction) =>
    t('dateTimeFormats.shortWeekdayDateTime', 'ccc, MMM d, yyyy h:mmaaa'),
  shortWeekdayTime: (t: TFunction) => t('dateTimeFormats.shortWeekdayTime', 'ccc h:mmaaa'),
  weekdayMidnight: (t: TFunction) => t('dateTimeFormats.weekdayMidnight', "ccc 'midnight'"),
  weekdayNoon: (t: TFunction) => t('dateTimeFormats.weekdayNoon', "ccc 'noon'"),
  year: (t: TFunction) => t('dateTimeFormats.year', 'yyyy'),
};

export type DateTimeFormatKey = keyof typeof DateTimeFormatGenerators;
