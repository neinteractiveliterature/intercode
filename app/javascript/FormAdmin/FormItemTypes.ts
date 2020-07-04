import { ParsedFormItem, WithRequiredIdentifier } from './FormItemUtils';
import { TimeblockPreference, TimeblockDefinition, TimeblockOmission } from '../FormPresenter/TimeblockTypes';

export type TimeblockPreferenceFormItemProps = {
  caption: string,
  timeblocks: TimeblockDefinition[],
  omit_timeblocks?: TimeblockOmission[],
  hide_timestamps?: boolean,
  required?: boolean,
};

export type TimeblockPreferenceFormItem = (
  WithRequiredIdentifier<ParsedFormItem<TimeblockPreference[], TimeblockPreferenceFormItemProps>>
  & {
    item_type: 'timeblock_preference'
  }
);

export type TimespanFormItemProps = {
  caption: string,
  required?: boolean,
};

export type TimespanFormItem = (
  WithRequiredIdentifier<ParsedFormItem<number, TimespanFormItemProps>> &
  { item_type: 'timespan' }
);
