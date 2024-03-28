import { useCallback } from 'react';
import * as React from 'react';
import { BooleanInput, MultipleChoiceInput, usePropertySetters } from '@neinteractiveliterature/litform';

import ScheduledValueEditor, {
  scheduledValueReducer,
  ScheduledValueReducerAction,
} from '../BuiltInFormControls/ScheduledValueEditor';
import { timezoneNameForConvention } from '../TimeUtils';
import MaximumEventSignupsPreview, {
  MaximumEventSignupsValue,
  MAXIMUM_EVENT_SIGNUPS_OPTIONS,
} from './MaximumEventSignupsPreview';
import type { ConventionFormConvention } from './ConventionForm';
import { ShowSchedule, SignupMode } from '../graphqlTypes.generated';

const buildMaximumEventSignupsInput = (
  value: MaximumEventSignupsValue | undefined,
  onChange: React.Dispatch<MaximumEventSignupsValue | undefined>,
) => {
  const processChangeEvent = (event: React.FocusEvent<HTMLSelectElement>) => {
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
    <select className="form-select" value={value} onChange={processChangeEvent}>
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
}: ConventionFormEventsSectionProps): JSX.Element {
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
            label: 'Moderated (attendees can request signups and signup changes but con staff must approve them)',
          },
          {
            value: 'ranked_choice',
            label:
              'Ranked choice (attendees make a ranked list of choices and the site attempts to give everyone what they want)',
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
        <MaximumEventSignupsPreview
          maximumEventSignups={convention.maximum_event_signups}
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
