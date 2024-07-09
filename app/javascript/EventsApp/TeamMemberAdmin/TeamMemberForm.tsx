import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  usePropertySetters,
  useFunctionalStateUpdater,
  BootstrapFormCheckbox,
  MultipleChoiceInput,
  HelpPopover,
} from '@neinteractiveliterature/litform';

import { ReceiveSignupEmail } from '../../graphqlTypes.generated';
import { TeamMembersQueryData } from './queries.generated';

export type TeamMemberFormProps = {
  event: TeamMembersQueryData['convention']['event'];
  disabled?: boolean;
  value: Partial<TeamMembersQueryData['convention']['event']['team_members'][0]>;
  onChange: React.Dispatch<Partial<TeamMembersQueryData['convention']['event']['team_members'][0]>>;
};

function TeamMemberForm({ event, disabled, value, onChange }: TeamMemberFormProps): JSX.Element {
  const { t } = useTranslation();
  const setValue = useFunctionalStateUpdater(value, onChange);
  const [setDisplayTeamMember, setShowEmail, setReceiveConEmail, setReceiveSignupEmail] = usePropertySetters(
    setValue,
    'display_team_member',
    'show_email',
    'receive_con_email',
    'receive_signup_email',
  );

  const teamMemberName = event.event_category.team_member_name;
  const checkboxProperties = [
    {
      name: 'display_team_member',
      label: t('events.teamMemberAdmin.displayLabel', {
        teamMemberName,
      }) as string,
      value: value.display_team_member,
      onChange: setDisplayTeamMember,
    },
    {
      name: 'show_email',
      label: (
        <>
          {t('events.teamMemberAdmin.showEmail.label')}{' '}
          <HelpPopover iconSet="bootstrap-icons">{t('events.teamMemberAdmin.showEmail.helpPopover')}</HelpPopover>
        </>
      ),
      value: value.show_email,
      onChange: setShowEmail,
    },
    {
      name: 'receive_con_email',
      label: t('events.teamMemberAdmin.receiveConEmailLabel'),
      value: value.receive_con_email,
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
        caption={t('events.teamMemberAdmin.receiveSignupEmailLabel')}
        choices={[
          {
            label: t('events.teamMemberAdmin.receiveSignupEmail.allSignups'),
            value: 'ALL_SIGNUPS',
          },
          {
            label: t('events.teamMemberAdmin.receiveSignupEmail.nonWaitlistSignups'),
            value: 'NON_WAITLIST_SIGNUPS',
          },
          { label: t('events.teamMemberAdmin.receiveSignupEmail.noEmail'), value: 'NO' },
        ]}
        value={value.receive_signup_email}
        onChange={(newValue: ReceiveSignupEmail) => setReceiveSignupEmail(newValue)}
      />
    </>
  );
}

export default TeamMemberForm;
