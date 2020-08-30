import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

import BootstrapFormCheckbox from '../../BuiltInFormControls/BootstrapFormCheckbox';
import MultipleChoiceInput from '../../BuiltInFormControls/MultipleChoiceInput';
import { ReceiveSignupEmail } from '../../graphqlTypes.generated';
import HelpPopover from '../../UIComponents/HelpPopover';
import useStatePropertyUpdater from '../../useStatePropertyUpdater';
import { TeamMembersQueryQuery } from './queries.generated';

export type TeamMemberFormProps = {
  event: TeamMembersQueryQuery['event'];
  disabled?: boolean;
  value: Partial<TeamMembersQueryQuery['event']['team_members'][0]>;
  onChange: React.Dispatch<Partial<TeamMembersQueryQuery['event']['team_members'][0]>>;
};

function TeamMemberForm({ event, disabled, value, onChange }: TeamMemberFormProps) {
  const { t } = useTranslation();
  const setTeamMemberState = useStatePropertyUpdater(onChange);

  const teamMemberName = event.event_category.team_member_name;
  const checkboxProperties = [
    {
      name: 'display_team_member',
      label: t('events.teamMemberAdmin.displayLabel', 'Display as {{ teamMemberName }}', {
        teamMemberName,
      }),
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
    },
    {
      name: 'receive_con_email',
      label: t('events.teamMemberAdmin.receiveConEmailLabel', 'Receive email from convention'),
    },
  ] as const;

  return (
    <>
      {checkboxProperties.map(({ name, label }) => (
        <BootstrapFormCheckbox
          key={name}
          type="checkbox"
          label={label}
          name={name}
          disabled={disabled}
          checked={value[name] ?? false}
          onCheckedChange={setTeamMemberState(name)}
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
        value={value.receive_signup_email}
        onChange={(newValue: ReceiveSignupEmail) =>
          setTeamMemberState('receive_signup_email')(newValue)
        }
      />
    </>
  );
}

export default TeamMemberForm;
