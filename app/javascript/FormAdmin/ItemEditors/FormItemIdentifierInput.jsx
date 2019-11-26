import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pluralize } from 'inflected';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';

function FormItemIdentifierInput({ formType, value, onChange }) {
  const standardItems = formType.standard_items || {};
  const standardIdentifiers = useMemo(
    () => Object.entries(standardItems).map(([identifier]) => (identifier)),
    [standardItems],
  );

  const normalizedIdentifier = (value || '');
  const identifierIsReserved = standardIdentifiers.includes(normalizedIdentifier.toLowerCase());

  return (
    <BootstrapFormInput
      label="Identifier"
      className={classNames('form-control', {
        'is-invalid': identifierIsReserved,
      })}
      invalidFeedback={
        identifierIsReserved && (
          <>
            <i className="fa fa-warning" />
            {' '}
            “
            {normalizedIdentifier}
            ”
            {' '}
            is a reserved identifier in
            {' '}
            {pluralize(formType.description)}
          </>
        )
      }
      helpText={
        `An identifier is a short name for your custom form items.  It should contain only lowercase
        letters, digits, and underscores (_).  It must be unique across all items in this form.`
      }
      value={value}
      onTextChange={onChange}
    />
  );
}

FormItemIdentifierInput.propTypes = {
  formType: PropTypes.shape({
    description: PropTypes.string.isRequired,
    standard_items: PropTypes.shape({}),
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

FormItemIdentifierInput.defaultProps = {
  value: '',
};

export default FormItemIdentifierInput;
