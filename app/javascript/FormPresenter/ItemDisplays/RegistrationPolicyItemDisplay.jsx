import React from 'react';

import presets from '../../RegistrationPolicy/RegistrationPolicyPresets';
import { RegistrationPolicyPropType } from '../../RegistrationPolicy/RegistrationPolicy';
import RegistrationPolicyDisplay from '../../RegistrationPolicy/RegistrationPolicyDisplay';

class RegistrationPolicyItemDisplay extends React.PureComponent {
  static propTypes = {
    value: RegistrationPolicyPropType.isRequired,
  };

  render = () => (
    <RegistrationPolicyDisplay registrationPolicy={this.props.value} presets={presets} />
  )
}

export default RegistrationPolicyItemDisplay;
