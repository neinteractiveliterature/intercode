import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

import BootstrapFormCheckbox from '../../BuiltInFormControls/BootstrapFormCheckbox';
import MultipleChoiceInput from '../../BuiltInFormControls/MultipleChoiceInput';
import { ReceiveSignupEmail } from '../../graphqlTypes.generated';
import HelpPopover from '../../UIComponents/HelpPopover';
import { usePartialState, usePartialStateFactory } from '../../usePartialState';
import { TeamMembersQueryQuery } from './queries.generated';

export type TeamMemberFormProps = {
  event: TeamMembersQueryQuery['event'];
  disabled?: boolean;
  value: Partial<TeamMembersQueryQuery['event']['team_members'][0]>;
  onChange: React.Dispatch<Partial<TeamMembersQueryQuery['event']['team_members'][0]>>;
};

function TeamMemberForm({ event, disabled, value, onChange }: TeamMemberFormProps) {
  const { t } = useTranslation();
  const factory = usePartialStateFactory(value, onChange);
  const [displayTeamMember, setDisplayTeamMember] = usePartialState(factory, 'display_team_member');
  const [showEmail, setShowEmail] = usePartialState(factory, 'show_email');
  const [receiveConEmail, setReceiveConEmail] = usePartialState(factory, 'receive_con_email');
  const [receiveSignupEmail, setReceiveSignupEmail] = usePartialState(
    factory,
    'receive_signup_email',
  );

  const teamMemberName = event.event_category.team_member_name;
  const checkboxProperties = [
    {
      name: 'display_team_member',
      label: t('events.teamMemberAdmin.displayLabel', 'Display as {{ teamMemberName }}', {
        teamMemberName,
      }),
      value: displayTeamMember,
      onChange: setDisplayTeamMember,
    },
    {
      name: 'show_email',
      label: (
        <Trans i18nKey="events.teamMemberAdmin.showEmailLabel">
          Show individual email address on event page{' '}
          <HelpPopover>
            Selecting this option will make the individual email address for this{' '}
            {{ teamMemberName }} appear on the event page, but only for logged-in site users.
          </HelpPopover>
        </Trans>
      ),
      value: showEmail,
      onChange: setShowEmail,
    },
    {
      name: 'receive_con_email',
      label: t('events.teamMemberAdmin.receiveConEmailLabel', 'Receive email from convention'),
      value: receiveConEmail,
      onChange: setReceiveConEmail,
    },
  ] as const;

  return (
    <>
      {checkboxProperties.map(({ name, label, value: checkboxValue, onChange: checkboxChange }) => (
        <BootstrapFormCheckbox
          key={name}
          type="checkbox"
          label={label}
          name={name}
          disabled={disabled}
          checked={checkboxValue ?? false}
          onCheckedChange={checkboxChange}
        />
      ))}

      <MultipleChoiceInput
        caption={t(
          'events.teamMemberAdmin.receiveSignupEmailLabel',
          'Receive email on signup and withdrawal',
        )}
        choices={[
          {
            label: t(
              'events.teamMemberAdmin.receiveSignupEmail.allSignups',
              'Yes, all signup activity',
            ),
            value: 'ALL_SIGNUPS',
          },
          {
            label: t(
              'events.teamMemberAdmin.receiveSignupEmail.nonWaitlistSignups',
              'Yes, except joining and dropping from waitlist',
            ),
            value: 'NON_WAITLIST_SIGNUPS',
          },
          { label: t('events.teamMemberAdmin.receiveSignupEmail.noEmail', 'No'), value: 'NO' },
        ]}
        value={receiveSignupEmail}
        onChange={(newValue: ReceiveSignupEmail) => setReceiveSignupEmail(newValue)}
      />
    </>
  );
}

export default TeamMemberForm;
