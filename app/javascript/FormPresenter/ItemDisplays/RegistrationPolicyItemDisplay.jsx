import React from 'react';

import presets from '../../RegistrationPolicy/RegistrationPolicyPresets';
import RegistrationPolicy from '../../RegistrationPolicy/RegistrationPolicy';
import RegistrationPolicyDisplay from '../../RegistrationPolicy/RegistrationPolicyDisplay';

class RegistrationPolicyItemDisplay extends React.PureComponent {
  static propTypes = {
    value: RegistrationPolicy.apiRepresentationPropType.isRequired,
  };

  render = () => {
    const registrationPolicy = RegistrationPolicy.fromAPI(this.props.value);
    return <RegistrationPolicyDisplay registrationPolicy={registrationPolicy} presets={presets} />;
  }
}

export default RegistrationPolicyItemDisplay;
