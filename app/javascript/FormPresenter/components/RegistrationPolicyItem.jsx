import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import RegistrationPolicy from '../../Models/RegistrationPolicy';
import RegistrationPolicyEditor from '../../BuiltInFormControls/RegistrationPolicyEditor';
import presets from '../../RegistrationPolicyPresets';

class RegistrationPolicyItem extends React.Component {
  static propTypes = {
    value: RegistrationPolicy.apiRepresentationPropType,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      registrationPolicy: RegistrationPolicy.fromAPI(this.props.value),
    };
  }

  registrationPolicyChanged = (newRegistrationPolicy) => {
    this.setState(
      { registrationPolicy: newRegistrationPolicy },
      () => { this.props.onChange(newRegistrationPolicy.getAPIRepresentation()); },
    );
  }

  render = () => (
    <fieldset className="form-group">
      <RegistrationPolicyEditor
        registrationPolicy={this.state.registrationPolicy}
        onChange={this.registrationPolicyChanged}
        presets={presets}
      />
    </fieldset>
  )
}

export default RegistrationPolicyItem;
