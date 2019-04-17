import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';

import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import StaffPositionPropType from './StaffPositionPropType';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import { mutator, Transforms } from '../ComposableFormUtils';

class StaffPositionForm extends React.Component {
  static propTypes = {
    staffPosition: StaffPositionPropType.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.mutator = mutator({
      getState: () => this.props.staffPosition,
      setState: this.props.onChange,
      transforms: {
        name: Transforms.identity,
        email: Transforms.identity,
        visible: Transforms.identity,
        user_con_profiles: Transforms.identity,
      },
    });
  }

  render = () => {
    const userConProfileSelectId = this.nextUniqueId();

    return (
      <div>
        <BootstrapFormInput
          name="name"
          label="Position name"
          value={this.props.staffPosition.name || ''}
          onChangeText={this.mutator.name}
        />

        <BootstrapFormInput
          name="email"
          type="email"
          label="Contact email"
          value={this.props.staffPosition.email || ''}
          onChangeText={this.mutator.email}
        />

        <BooleanInput
          name="visible"
          caption="Visible in CMS content?"
          value={this.props.staffPosition.visible}
          onChange={this.mutator.visible}
        />

        <div className="form-group">
          <label htmlFor={userConProfileSelectId}>People</label>
          <UserConProfileSelect
            id={userConProfileSelectId}
            isMulti
            value={this.props.staffPosition.user_con_profiles}
            onChange={this.mutator.user_con_profiles}
          />
        </div>
      </div>
    );
  }
}

export default StaffPositionForm;
