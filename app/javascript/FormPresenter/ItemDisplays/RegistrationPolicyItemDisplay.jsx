import React from 'react';
import PropTypes from 'prop-types';

import { RegistrationPolicyPropType } from '../../RegistrationPolicy/RegistrationPolicy';
import RegistrationPolicyDisplay from '../../RegistrationPolicy/RegistrationPolicyDisplay';

class RegistrationPolicyItemDisplay extends React.PureComponent {
  static propTypes = {
    formItem: PropTypes.shape({
      properties: PropTypes.shape({
        presets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      }).isRequired,
    }).isRequired,
    value: RegistrationPolicyPropType.isRequired,
  };

  render = () => (
    <RegistrationPolicyDisplay
      registrationPolicy={this.props.value}
      presets={this.props.formItem.properties.presets}
    />
  )
}

export default RegistrationPolicyItemDisplay;
