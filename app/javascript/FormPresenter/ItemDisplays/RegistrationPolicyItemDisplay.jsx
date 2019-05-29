import React from 'react';
import PropTypes from 'prop-types';

import { RegistrationPolicyPropType } from '../../RegistrationPolicy/RegistrationPolicy';
import RegistrationPolicyDisplay from '../../RegistrationPolicy/RegistrationPolicyDisplay';

function RegistrationPolicyItemDisplay({ formItem, value }) {
  return (
    <RegistrationPolicyDisplay
      registrationPolicy={value}
      presets={formItem.properties.presets}
    />
  );
}

RegistrationPolicyItemDisplay.propTypes = {
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      presets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    }).isRequired,
  }).isRequired,
  value: RegistrationPolicyPropType.isRequired,
};

export default RegistrationPolicyItemDisplay;
