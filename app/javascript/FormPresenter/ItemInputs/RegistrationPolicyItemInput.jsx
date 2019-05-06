import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { RegistrationPolicyPropType } from '../../RegistrationPolicy/RegistrationPolicy';
import RegistrationPolicyEditor from '../../RegistrationPolicy/RegistrationPolicyEditor';

function RegistrationPolicyItemInput({
  formItem, value, valueInvalid, onChange,
}) {
  const defaultValue = useMemo(
    () => {
      const { presets, allow_custom: allowCustom } = formItem.properties;
      if (presets && presets.length === 1 && !allowCustom) {
        return presets[0].policy;
      }
      return null;
    },
    [formItem.properties],
  );

  const effectiveValue = (!value || !value.buckets || value.buckets.length === 0)
    ? defaultValue
    : value;

  return (
    <fieldset className="form-group">
      <div className={classNames({ 'border-0': !valueInvalid, 'border rounded border-danger': valueInvalid })}>
        <RegistrationPolicyEditor
          registrationPolicy={effectiveValue}
          onChange={onChange}
          presets={formItem.properties.presets}
          allowCustom={formItem.properties.allow_custom}
        />
        {
          valueInvalid
            ? (
              <span className="text-danger">
                This field is required.
              </span>
            )
            : null
        }
      </div>
    </fieldset>
  );
}

RegistrationPolicyItemInput.propTypes = {
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      presets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      allow_custom: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  value: RegistrationPolicyPropType,
  valueInvalid: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

RegistrationPolicyItemInput.defaultProps = {
  value: null,
  valueInvalid: false,
};

export default RegistrationPolicyItemInput;
