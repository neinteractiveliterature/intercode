import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';

import BootstrapFormCheckbox from '../../BuiltInFormControls/BootstrapFormCheckbox';
import MultipleChoiceInput from '../../BuiltInFormControls/MultipleChoiceInput';
import { mutator, Transforms } from '../../ComposableFormUtils';
import HelpPopover from '../../UIComponents/HelpPopover';

function TeamMemberForm({
  event, disabled, value, onChange,
}) {
  const { t } = useTranslation();
  const formMutator = mutator({
    getState: () => value,
    setState: onChange,
    transforms: {
      display_team_member: Transforms.identity,
      show_email: Transforms.identity,
      receive_con_email: Transforms.identity,
      receive_signup_email: Transforms.identity,
    },
  });

  const teamMemberName = event.event_category.team_member_name;

  return (
    <>
      {
        [
          {
            name: 'display_team_member',
            label: t(
              'events.teamMemberAdmin.displayLabel',
              'Display as {{ teamMemberName }}',
              { teamMemberName },
            ),
          },
          {
            name: 'show_email',
            label: (
              <Trans i18nKey="events.teamMemberAdmin.showEmailLabel">
                Show individual email address on event page
                {' '}
                <HelpPopover>
                  Selecting this option will make the individual email address for this
                  {' '}
                  {{ teamMemberName }}
                  {' '}
                  appear on the event page, but only for logged-in site users.
                </HelpPopover>
              </Trans>
            ),
          },
          {
            name: 'receive_con_email',
            label: t('events.teamMemberAdmin.receiveConEmailLabel', 'Receive email from convention'),
          },
        ].map(({ name, label }) => (
          <BootstrapFormCheckbox
            key={name}
            label={label}
            name={name}
            disabled={disabled}
            checked={value[name]}
            onCheckedChange={formMutator[name]}
          />
        ))
      }

      <MultipleChoiceInput
        caption={t('events.teamMemberAdmin.receiveSignupEmailLabel', 'Receive email on signup and withdrawal')}
        choices={[
          {
            label: t('events.teamMemberAdmin.receiveSignupEmail.allSignups', 'Yes, all signup activity'),
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
        onChange={formMutator.receive_signup_email}
      />
    </>
  );
}

TeamMemberForm.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    event_category: PropTypes.shape({
      can_provide_tickets: PropTypes.bool.isRequired,
      team_member_name: PropTypes.string.isRequired,
    }).isRequired,
    team_members: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.shape({
    display_team_member: PropTypes.bool,
    show_email: PropTypes.bool,
    receive_con_email: PropTypes.bool,
    receive_signup_email: PropTypes.oneOf(['ALL_SIGNUPS', 'NON_WAITLIST_SIGNUPS', 'NO']),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

TeamMemberForm.defaultProps = {
  disabled: false,
};

export default TeamMemberForm;
