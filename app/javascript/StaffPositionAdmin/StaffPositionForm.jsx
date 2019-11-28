import React from 'react';
import PropTypes from 'prop-types';

import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import StaffPositionPropType from './StaffPositionPropType';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import { mutator, Transforms } from '../ComposableFormUtils';
import useUniqueId from '../useUniqueId';

function StaffPositionForm({ staffPosition, onChange }) {
  const formMutator = mutator({
    getState: () => staffPosition,
    setState: onChange,
    transforms: {
      name: Transforms.identity,
      email: Transforms.identity,
      visible: Transforms.identity,
      user_con_profiles: Transforms.identity,
    },
  });
  const userConProfileSelectId = useUniqueId('user-con-profile-id-');

  return (
    <div>
      <BootstrapFormInput
        name="name"
        label="Position name"
        value={staffPosition.name || ''}
        onTextChange={formMutator.name}
      />

      <BootstrapFormInput
        name="email"
        type="email"
        label="Contact email"
        value={staffPosition.email || ''}
        onTextChange={formMutator.email}
      />

      <BooleanInput
        name="visible"
        caption="Visible in CMS content?"
        value={staffPosition.visible}
        onChange={formMutator.visible}
      />

      <div className="form-group">
        <label htmlFor={userConProfileSelectId}>People</label>
        <UserConProfileSelect
          id={userConProfileSelectId}
          isMulti
          value={staffPosition.user_con_profiles}
          onChange={formMutator.user_con_profiles}
        />
      </div>
    </div>
  );
}

StaffPositionForm.propTypes = {
  staffPosition: StaffPositionPropType.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StaffPositionForm;
