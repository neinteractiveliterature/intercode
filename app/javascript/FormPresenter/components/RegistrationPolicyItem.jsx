import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import classNames from 'classnames';
import RegistrationPolicy from '../../Models/RegistrationPolicy';
import RegistrationPolicyEditor from '../../BuiltInFormControls/RegistrationPolicyEditor';
import presets from '../../RegistrationPolicyPresets';

class RegistrationPolicyItem extends React.Component {
  static propTypes = {
    formItem: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
    }).isRequired,
    value: RegistrationPolicy.apiRepresentationPropType,
    valueInvalid: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onInteract: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
    valueInvalid: false,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      registrationPolicy: RegistrationPolicy.fromAPI(this.props.value),
    };
  }

  registrationPolicyChanged = (newRegistrationPolicy) => {
    this.props.onInteract(this.props.formItem.identifier);
    this.setState(
      { registrationPolicy: newRegistrationPolicy },
      () => { this.props.onChange(newRegistrationPolicy.getAPIRepresentation()); },
    );
  }

  render = () => (
    <fieldset className={classNames('form-group', 'p-1', { 'border border-danger rounded': this.props.valueInvalid })}>
      <RegistrationPolicyEditor
        registrationPolicy={this.state.registrationPolicy}
        onChange={this.registrationPolicyChanged}
        presets={presets}
      />
    </fieldset>
  )
}

export default RegistrationPolicyItem;
