import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import classNames from 'classnames';
import FieldRequiredFeedback from './FieldRequiredFeedback';
import RegistrationPolicy from '../../Models/RegistrationPolicy';
import RegistrationPolicyEditor from '../../BuiltInFormControls/RegistrationPolicyEditor';
import presets from '../../RegistrationPolicyPresets';

class RegistrationPolicyItem extends React.Component {
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
      <div className={classNames('form-control', { 'border-0': !this.props.valueInvalid, 'is-invalid': this.props.valueInvalid })}>
        <RegistrationPolicyEditor
          registrationPolicy={this.state.registrationPolicy}
          onChange={this.registrationPolicyChanged}
          presets={presets}
        />
      </div>
      <FieldRequiredFeedback valueInvalid={this.props.valueInvalid} />
    </fieldset>
  )
}

export default RegistrationPolicyItem;
