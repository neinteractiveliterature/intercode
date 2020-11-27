import { TFunction } from 'i18next';

// This sort of convoluted format is really here just so i18next-parser can do what it needs to do
// We don't want to actually import this file if possible; just use i18next along with the generated
// type below
const DateTimeFormatGenerators = {
  anytime: (t: TFunction) => t('dateTimeFormats.anytime', "'anytime'"),
  indefinitely: (t: TFunction) => t('dateTimeFormats.indefinitely', "'indefinitely'"),
  longDate: (t: TFunction) => t('dateTimeFormats.longDate', 'MMMM D, yyyy'),
  longDateTime: (t: TFunction) => t('dateTimeFormats.longDateTime', 'MMMM d, yyyy - h:mmaaa'), // todo: dashes???
  longDayYear: (t: TFunction) => t('dateTimeFormats.longDayYear', 'D, yyyy'),
  longYearMonth: (t: TFunction) => t('dateTimeFormats.longYearMonth', 'MMMM D'),
  shortHour: (t: TFunction) => t('dateTimeFormats.shortHour', 'haaa'),
  shortTime: (t: TFunction) => t('dateTimeFormats.shortTime', 'h:mmaaa'),
  shortWeekdayTime: (t: TFunction) => t('dateTimeFormats.shortWeekdayTime', 'ccc h:mmaaa'),
  weekdayMidnight: (t: TFunction) => t('dateTimeFormats.weekdayMidnight', "ccc 'midnight'"),
  midnight: (t: TFunction) => t('dateTimeFormats.midnight', "'midnight'"),
  weekdayNoon: (t: TFunction) => t('dateTimeFormats.weekdayNoon', "ccc 'noon'"),
  noon: (t: TFunction) => t('dateTimeFormats.noon', "'noon'"),
};

export type DateTimeFormatKey = keyof typeof DateTimeFormatGenerators;
