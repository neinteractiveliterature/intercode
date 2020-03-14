import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import StaffPositionPropType from './StaffPositionPropType';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import { mutator, Transforms } from '../ComposableFormUtils';
import AppRootContext from '../AppRootContext';
import EmailAliasInput from '../BuiltInFormControls/EmailAliasInput';
import FormGroupWithLabel from '../BuiltInFormControls/FormGroupWithLabel';
import ArrayEditor from '../BuiltInFormControls/ArrayEditor';

function StaffPositionForm({ staffPosition, onChange }) {
  const { conventionDomain } = useContext(AppRootContext);
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

  const setEmailAliases = (emailAliases) => onChange({
    ...staffPosition, email_aliases: emailAliases,
  });
  const setCcAddresses = (ccAddresses) => onChange({
    ...staffPosition, cc_addresses: ccAddresses,
  });

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
        helpText={`If this address ends in @${conventionDomain}, email will be automatically forwarded to staff members.`}
      />

      <ArrayEditor
        header={(
          <>
            <legend className="col-form-label p-0">Email aliases</legend>
            <small className="text-muted">
              Email sent to these addresses will also be automatically forwarded to staff members.
            </small>
          </>
        )}
        array={staffPosition.email_aliases}
        onChange={setEmailAliases}
        renderValue={(value) => (
          <>
            {value}
            <em>
              @
              {conventionDomain}
            </em>
          </>
        )}
        getDeleteButtonLabel={(value) => `Delete alias ${value}@${conventionDomain}`}
        getDeletePrompt={(value) => `Are you sure you want to delete the email alias ${value}@${conventionDomain}?`}
        renderAddValueInput={({ value, onChange: onAddValueChange, onKeyDown }) => (
          <EmailAliasInput
            value={value}
            onTextChange={onAddValueChange}
            aria-label="Add email alias (portion before @ sign)"
            domain={conventionDomain}
            name="add-alias"
            onKeyDown={onKeyDown}
          />
        )}
        addValueLabel="Add alias"
      />

      <BooleanInput
        name="visible"
        caption="Visible in CMS content?"
        value={staffPosition.visible}
        onChange={formMutator.visible}
      />

      <FormGroupWithLabel label="People" name="user-con-profiles">
        {(id) => (
          <UserConProfileSelect
            id={id}
            isMulti
            value={staffPosition.user_con_profiles}
            onChange={formMutator.user_con_profiles}
          />
        )}
      </FormGroupWithLabel>

      <ArrayEditor
        header={(
          <>
            <legend className="col-form-label p-0">CC addresses</legend>
            <small className="text-muted">
              Email sent to staff members will also be automatically forwarded to these addresses.
            </small>
          </>
        )}
        array={staffPosition.cc_addresses}
        onChange={setCcAddresses}
        renderValue={(value) => value}
        getDeleteButtonLabel={(value) => `Delete CC address ${value}`}
        getDeletePrompt={(value) => `Are you sure you want to delete the CC address ${value}?`}
        renderAddValueInput={({ value, onChange: onAddValueChange, onKeyDown }) => (
          <input
            className="form-control"
            value={value}
            onChange={(event) => onAddValueChange(event.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Add CC address"
          />
        )}
        addValueLabel="Add CC address"
      />
    </div>
  );
}

StaffPositionForm.propTypes = {
  staffPosition: StaffPositionPropType.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StaffPositionForm;
