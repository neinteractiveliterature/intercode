import React from 'react';
import PropTypes from 'prop-types';

import ArrayEditor from '../BuiltInFormControls/ArrayEditor';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';

function EmailRouteForm({ emailRoute, onChange }) {
  const changeField = (field) => (value) => onChange({ ...emailRoute, [field]: value });

  return (
    <>
      <BootstrapFormInput
        label="Receiver email"
        value={emailRoute.receiver_address}
        onTextChange={changeField('receiver_address')}
      />

      <ArrayEditor
        array={emailRoute.forward_addresses}
        onChange={changeField('forward_addresses')}
        header="Forward addresses"
        renderValue={(value) => value}
        getDeleteButtonLabel={(value) => `Delete forward address ${value}`}
        getDeletePrompt={(value) => `Are you sure you want to delete ${value} from the forward addresses?`}
        renderAddValueInput={({ value, onChange: onAddValueChange, onKeyDown }) => (
          <input
            type="email"
            className="form-control"
            value={value}
            onChange={(event) => onAddValueChange(event.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Forward address to add"
          />
        )}
        addValueLabel="Add forward address"
      />
    </>
  );
}

EmailRouteForm.propTypes = {
  emailRoute: PropTypes.shape({
    receiver_address: PropTypes.string.isRequired,
    forward_addresses: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EmailRouteForm;
