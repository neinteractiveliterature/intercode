import React from 'react';
import PropTypes from 'prop-types';

import BootstrapFormCheckbox from '../../BuiltInFormControls/BootstrapFormCheckbox';
import { mutator, Transforms } from '../../ComposableFormUtils';

function TeamMemberForm({
  event, disabled, value, onChange,
}) {
  const formMutator = mutator({
    getState: () => value,
    setState: onChange,
    transforms: {
      display: Transforms.checkboxChange,
      show_email: Transforms.checkboxChange,
      receive_con_email: Transforms.checkboxChange,
      receive_signup_email: Transforms.checkboxChange,
    },
  });

  return (
    [
      { name: 'display', label: `Display as ${event.team_member_name}` },
      { name: 'show_email', label: 'Show email address' },
      { name: 'receive_con_email', label: 'Receive email from convention' },
      { name: 'receive_signup_email', label: 'Receive email on signup and withdrawal' },
    ].map(({ name, label }) => (
      <BootstrapFormCheckbox
        key={name}
        label={label}
        name={name}
        disabled={disabled}
        checked={value[name]}
        onChange={formMutator[name]}
      />
    ))
  );
}

TeamMemberForm.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    can_provide_tickets: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    team_member_name: PropTypes.string.isRequired,
    team_members: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user_con_profile: PropTypes.shape({
      ticket: PropTypes.shape({}),
    }),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

TeamMemberForm.defaultProps = {
  disabled: false,
};

export default TeamMemberForm;
