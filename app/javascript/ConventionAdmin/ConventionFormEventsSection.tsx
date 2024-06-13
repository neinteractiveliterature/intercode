import * as React from 'react';
import { BooleanInput, MultipleChoiceInput, usePropertySetters } from '@neinteractiveliterature/litform';

import type { ConventionFormConvention } from './ConventionForm';
import { ShowSchedule, SignupAutomationMode, SignupMode } from '../graphqlTypes.generated';
import { Trans } from 'react-i18next';

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
  const [
    setSignupMode,
    setSignupAutomationMode,
    setSignupRequestsOpen,
    setAcceptingProposals,
    setShowEventList,
    setShowSchedule,
  ] = usePropertySetters(
    setConvention,
    'signup_mode',
    'signup_automation_mode',
    'signup_requests_open',
    'accepting_proposals',
    'show_event_list',
    'show_schedule',
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
        ]}
        value={convention.signup_mode}
        onChange={(newValue: string) => setSignupMode(newValue as SignupMode)}
        disabled={disabled}
      />

      <MultipleChoiceInput
        name="signup_automation_mode"
        caption="Signup automation mode"
        choices={[
          {
            value: 'none',
            label: 'Signups are fully manual',
          },
          {
            value: 'ranked_choice',
            label:
              'Ranked choice (attendees make a ranked list of choices and the site attempts to give everyone what they want)',
          },
        ]}
        value={convention.signup_automation_mode}
        onChange={(newValue: string) => setSignupAutomationMode(newValue as SignupAutomationMode)}
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

      <div className="alert alert-info">
        <Trans i18nKey="admin.convention.signupScheduleMoved">
          The signup schedule editor has moved! To edit the signup schedule for this convention, go to the Admin menu
          and choose “Signup rounds.”
        </Trans>
      </div>
    </>
  );
}

export default ConventionFormEventsSection;
