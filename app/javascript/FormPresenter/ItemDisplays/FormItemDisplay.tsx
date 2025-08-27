import { assertNever } from 'assert-never';

import AgeRestrictionsDisplay from './AgeRestrictionsDisplay';
import DateItemDisplay from './DateItemDisplay';
import EventEmailDisplay from './EventEmailDisplay';
import FreeTextItemDisplay from './FreeTextItemDisplay';
import MultipleChoiceItemDisplay from './MultipleChoiceItemDisplay';
import RegistrationPolicyItemDisplay from './RegistrationPolicyItemDisplay';
import StaticTextItem from '../StaticTextItem';
import TimeblockPreferenceItemDisplay from './TimeblockPreferenceItemDisplay';
import TimespanItemDisplay from './TimespanItemDisplay';
import { Convention } from '../../graphqlTypes.generated';
import {
  TypedFormItem,
  FormItemValueType,
  MultipleChoiceFormItem,
  RegistrationPolicyFormItem,
  TimeblockPreferenceFormItem,
  TimespanFormItem,
  AgeRestrictionsValue,
  EventEmailValue,
} from '../../FormAdmin/FormItemUtils';
import { FormItemDisplayMode } from './FormItemDisplayMode';

export type ConventionForFormItemDisplay = Pick<
  Convention,
  'timezone_name' | 'timezone_mode' | 'starts_at' | 'ends_at' | 'event_mailing_list_domain'
>;

export type FormItemDisplayProps = {
  formItem: TypedFormItem;
  value: unknown;
  convention: ConventionForFormItemDisplay;
  displayMode: FormItemDisplayMode;
};

function FormItemDisplay({ formItem, value, convention, displayMode }: FormItemDisplayProps): React.JSX.Element {
  if (value == null) {
    return <></>;
  }

  switch (formItem.item_type) {
    case 'age_restrictions':
      return <AgeRestrictionsDisplay displayMode={displayMode} value={value as AgeRestrictionsValue} />;
    case 'date':
      return <DateItemDisplay value={value as string} />;
    case 'event_email':
      return <EventEmailDisplay convention={convention} value={value as EventEmailValue} displayMode={displayMode} />;
    case 'free_text':
      return <FreeTextItemDisplay formItem={formItem} value={value as string} />;
    case 'multiple_choice':
      return (
        <MultipleChoiceItemDisplay formItem={formItem} value={value as FormItemValueType<MultipleChoiceFormItem>} />
      );
    case 'registration_policy':
      return (
        <RegistrationPolicyItemDisplay
          formItem={formItem}
          value={value as FormItemValueType<RegistrationPolicyFormItem>}
        />
      );
    case 'static_text':
      return <StaticTextItem formItem={formItem} />;
    case 'timeblock_preference':
      return (
        <TimeblockPreferenceItemDisplay
          formItem={formItem}
          value={value as FormItemValueType<TimeblockPreferenceFormItem>}
          convention={convention}
        />
      );
    case 'timespan':
      return <TimespanItemDisplay value={value as FormItemValueType<TimespanFormItem>} />;
    default:
      // we don't actually enforce this at the API level, so it could be an unknown type
      assertNever(formItem, true);
      return (
        <div>
          <code>{formItem.identifier}</code>
        </div>
      );
  }
}

export default FormItemDisplay;
