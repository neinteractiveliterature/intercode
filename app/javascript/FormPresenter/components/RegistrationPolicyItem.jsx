// @flow

import React from 'react';
import { enableUniqueIds } from 'react-html-id';
import RegistrationPolicy, { type RegistrationPolicyAPIRepresentation } from '../../Models/RegistrationPolicy';
import RegistrationPolicyEditor from '../../BuiltInFormControls/RegistrationPolicyEditor';
import presets from '../../RegistrationPolicyPresets';

type Props = {
  formItem: {},
  value?: RegistrationPolicyAPIRepresentation,
  onChange: (any) => void,
};

type State = {
  registrationPolicy: RegistrationPolicy,
};

class RegistrationPolicyItem extends React.Component {
  constructor(props: Props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      registrationPolicy: RegistrationPolicy.fromAPI(this.props.value),
    };
  }

  state: State
  props: Props

  registrationPolicyChanged = (newRegistrationPolicy: RegistrationPolicy) => {
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
