import { assertNever } from 'assert-never';

import FreeTextItemChangeDisplay from './FreeTextItemChangeDisplay';
import RegistrationPolicyItemChangeDisplay from './RegistrationPolicyItemChangeDisplay';
import AgeRestrictionsItemChangeDisplay from './AgeRestrictionsItemChangeDisplay';
import EventEmailItemChangeDisplay from './EventEmailItemChangeDisplay';
import MultipleChoiceItemChangeDisplay from './MultipleChoiceItemChangeDisplay';
import TimespanItemChangeDisplay from './TimespanItemChangeDisplay';
import DateItemChangeDisplay from './DateItemChangeDisplay';
import TimeblockPreferenceItemChangeDisplay from './TimeblockPreferenceItemChangeDisplay';
import { Convention } from '../../graphqlTypes.generated';
import {
  TypedFormItem,
  AgeRestrictionsFormItem,
  DateFormItem,
  EventEmailFormItem,
  MultipleChoiceFormItem,
  RegistrationPolicyFormItem,
  TimespanFormItem,
  TimeblockPreferenceFormItem,
  FreeTextFormItem,
} from '../../FormAdmin/FormItemUtils';
import { ParsedFormResponseChange } from './FormItemChangeUtils';

export type ConventionForFormItemChangeDisplay = Pick<
  Convention,
  'timezone_name' | 'timezone_mode' | 'starts_at' | 'ends_at'
>;

export type FormItemChangeDisplayProps = {
  formItem: TypedFormItem;
  change: ParsedFormResponseChange<any>;
  convention: ConventionForFormItemChangeDisplay;
};

function FormItemChangeDisplay({ formItem, change, convention }: FormItemChangeDisplayProps) {
  switch (formItem.item_type) {
    case 'age_restrictions':
      return (
        <AgeRestrictionsItemChangeDisplay
          change={change as ParsedFormResponseChange<AgeRestrictionsFormItem>}
        />
      );
    case 'date':
      return <DateItemChangeDisplay change={change as ParsedFormResponseChange<DateFormItem>} />;
    case 'event_email':
      return (
        <EventEmailItemChangeDisplay
          change={change as ParsedFormResponseChange<EventEmailFormItem>}
        />
      );
    case 'free_text':
      return (
        <FreeTextItemChangeDisplay
          formItem={formItem}
          change={change as ParsedFormResponseChange<FreeTextFormItem>}
        />
      );
    case 'multiple_choice':
      return (
        <MultipleChoiceItemChangeDisplay
          change={change as ParsedFormResponseChange<MultipleChoiceFormItem>}
        />
      );
    case 'registration_policy':
      return (
        <RegistrationPolicyItemChangeDisplay
          change={change as ParsedFormResponseChange<RegistrationPolicyFormItem>}
        />
      );
    case 'static_text':
      return (
        <div>
          <code>static text change (this is probably a bug)</code>
        </div>
      );
    case 'timeblock_preference':
      return (
        <TimeblockPreferenceItemChangeDisplay
          formItem={formItem}
          change={change as ParsedFormResponseChange<TimeblockPreferenceFormItem>}
          convention={convention}
        />
      );
    case 'timespan':
      return (
        <TimespanItemChangeDisplay change={change as ParsedFormResponseChange<TimespanFormItem>} />
      );
    default:
      // we don't actually enforce this at the API level, so it could be an unknown type
      assertNever(formItem, true);
      return (
        <div>
          <code>{formItem.item_type}</code>
        </div>
      );
  }
}

export default FormItemChangeDisplay;
