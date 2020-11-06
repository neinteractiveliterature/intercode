import { useCallback } from 'react';
import * as React from 'react';

import BooleanInput from '../BuiltInFormControls/BooleanInput';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import ScheduledValueEditor, {
  scheduledValueReducer,
  ScheduledValueReducerAction,
} from '../BuiltInFormControls/ScheduledValueEditor';
import { timezoneNameForConvention } from '../TimeUtils';
import ScheduledValuePreview from '../UIComponents/ScheduledValuePreview';
import type { ConventionFormConvention } from './ConventionForm';
import { usePropertySetters } from '../usePropertySetters';
import { ShowSchedule, SignupMode } from '../graphqlTypes.generated';

export type MaximumEventSignupsValue = 'not_yet' | '1' | '2' | '3' | 'unlimited' | 'not_now';

export const MAXIMUM_EVENT_SIGNUPS_OPTIONS = [
  ['not_yet', 'No signups yet'],
  ['1', 'Up to 1 event'],
  ['2', 'Up to 2 events'],
  ['3', 'Up to 3 events'],
  ['unlimited', 'Signups fully open'],
  ['not_now', 'Signups frozen'],
] as const;

const MAXIMUM_EVENT_SIGNUPS_CLASSNAMES = {
  not_yet: 'maximum-event-signups-not-yet',
  '1': 'maximum-event-signups-1',
  '2': 'maximum-event-signups-2',
  '3': 'maximum-event-signups-3',
  unlimited: 'maximum-event-signups-unlimited',
  not_now: 'maximum-event-signups-not-now',
} as const;

function getMaximumEventSignupsClassName(value: string | undefined, nextValue: string | undefined) {
  const valueClassName =
    MAXIMUM_EVENT_SIGNUPS_CLASSNAMES[(value ?? 'not_yet') as MaximumEventSignupsValue] ?? '';

  if (value === nextValue || !nextValue) {
    return valueClassName;
  }

  const nextValueClassName =
    MAXIMUM_EVENT_SIGNUPS_CLASSNAMES[nextValue as MaximumEventSignupsValue] ?? '';

  return `${valueClassName} ${nextValueClassName}-transition`;
}

function getMaximumEventSignupsDescription(value: string | undefined) {
  return (MAXIMUM_EVENT_SIGNUPS_OPTIONS.find(([v]) => v === value) ?? ['', value])[1];
}

const buildMaximumEventSignupsInput = (
  value: MaximumEventSignupsValue | undefined,
  onChange: React.Dispatch<MaximumEventSignupsValue | undefined>,
) => {
  const processChangeEvent = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: newValue } = event.target;
    switch (newValue) {
      case 'not_yet':
      case '1':
      case '2':
      case '3':
      case 'unlimited':
      case 'not_now':
        return onChange(newValue);
      default:
        return onChange(undefined);
    }
  };

  const options = MAXIMUM_EVENT_SIGNUPS_OPTIONS.map(([optionValue, label]) => (
    <option key={optionValue} value={optionValue}>
      {label}
    </option>
  ));

  return (
    <select className="form-control custom-select" value={value} onChange={processChangeEvent}>
      <option aria-label="Blank placeholder option" />
      {options}
    </select>
  );
};

export type ConventionFormEventsSectionProps = {
  convention: ConventionFormConvention;
  setConvention: React.Dispatch<React.SetStateAction<ConventionFormConvention>>;
  disabled: boolean;
};

function ConventionFormEventsSection({
  convention,
  setConvention,
  disabled,
}: ConventionFormEventsSectionProps) {
  const timezoneName = timezoneNameForConvention(convention);
  const [
    setSignupMode,
    setSignupRequestsOpen,
    setAcceptingProposals,
    setShowEventList,
    setShowSchedule,
    setMaximumEventSignups,
  ] = usePropertySetters(
    setConvention,
    'signup_mode',
    'signup_requests_open',
    'accepting_proposals',
    'show_event_list',
    'show_schedule',
    'maximum_event_signups',
  );
  const dispatchMaximumEventSignups = useCallback(
    (action: ScheduledValueReducerAction<MaximumEventSignupsValue>) => {
      setMaximumEventSignups((prevState) => scheduledValueReducer(prevState, action));
    },
    [setMaximumEventSignups],
  );

  return (
    <>
      <MultipleChoiceInput
        name="signup_mode"
        caption="Signup mode"
        choices={[
          {
            value: 'self_service',
            label: 'Self-service (attendees can sign themselves up for events)',
          },
          {
            value: 'moderated',
            label:
              'Moderated (attendees can request signups and signup changes but con staff must approve them)',
          },
        ]}
        value={convention.signup_mode}
        onChange={(newValue: string) => setSignupMode(newValue as SignupMode)}
        disabled={disabled}
      />

      <BooleanInput
        name="signup_requests_open"
        caption="Signup requests open"
        value={convention.signup_requests_open}
        onChange={setSignupRequestsOpen}
        disabled={disabled || convention.signup_mode !== 'moderated'}
      />

      <BooleanInput
        name="accepting_proposals"
        caption="Accepting event proposals"
        value={convention.accepting_proposals ?? undefined}
        onChange={setAcceptingProposals}
        disabled={disabled || convention.site_mode === 'single_event'}
      />

      <MultipleChoiceInput
        name="show_event_list"
        caption="Show list of events"
        choices={[
          { value: 'no', label: 'No' },
          { value: 'priv', label: 'Only to users with prerelease schedule viewing permission' },
          {
            value: 'gms',
            label: 'Only to event team members and users with any schedule viewing permissions',
          },
          { value: 'yes', label: 'Yes, to everyone' },
        ]}
        value={convention.show_event_list}
        onChange={(newValue: string) => setShowEventList(newValue as ShowSchedule)}
        disabled={disabled || convention.site_mode === 'single_event'}
      />

      <MultipleChoiceInput
        name="show_schedule"
        caption="Show event schedule"
        choices={[
          { value: 'no', label: 'No' },
          { value: 'priv', label: 'Only to users with prerelease schedule viewing permission' },
          {
            value: 'gms',
            label: 'Only to event team members and users with any schedule viewing permissions',
          },
          { value: 'yes', label: 'Yes, to everyone' },
        ]}
        value={convention.show_schedule}
        onChange={(newValue: string) => setShowSchedule(newValue as ShowSchedule)}
        disabled={disabled || convention.site_mode === 'single_event'}
      />

      <fieldset>
        <legend className="col-form-label">Event signup schedule</legend>
        <ScheduledValuePreview
          scheduledValue={convention.maximum_event_signups ?? { timespans: [] }}
          getClassNameForValue={getMaximumEventSignupsClassName}
          getDescriptionForValue={getMaximumEventSignupsDescription}
          timezoneName={timezoneName}
        />
        <ScheduledValueEditor
          scheduledValue={convention.maximum_event_signups ?? { timespans: [] }}
          dispatch={dispatchMaximumEventSignups}
          timezone={timezoneName}
          buildValueInput={buildMaximumEventSignupsInput}
        />
      </fieldset>
    </>
  );
}

export default ConventionFormEventsSection;
