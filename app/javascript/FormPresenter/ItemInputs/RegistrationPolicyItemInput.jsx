import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import classNames from 'classnames';
import RegistrationPolicy from '../../Models/RegistrationPolicy';
import RegistrationPolicyEditor from '../../BuiltInFormControls/RegistrationPolicyEditor';
import presets from '../../RegistrationPolicyPresets';

class RegistrationPolicyItemInput extends React.Component {
  static propTypes = {
    value: RegistrationPolicy.apiRepresentationPropType,
    valueInvalid: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
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
    this.setState(
      { registrationPolicy: newRegistrationPolicy },
      () => { this.props.onChange(newRegistrationPolicy.getAPIRepresentation()); },
    );
  }

  render = () => (
    <fieldset className="form-group">
      <div className={classNames({ 'border-0': !this.props.valueInvalid, 'border rounded border-danger': this.props.valueInvalid })}>
        <RegistrationPolicyEditor
          registrationPolicy={this.state.registrationPolicy}
          onChange={this.registrationPolicyChanged}
          presets={presets}
        />
        {
          this.props.valueInvalid
            ? (
              <span className="text-danger">
                This field is required.
              </span>
            )
            : null
        }
      </div>
    </fieldset>
  )
}

export default RegistrationPolicyItemInput;
