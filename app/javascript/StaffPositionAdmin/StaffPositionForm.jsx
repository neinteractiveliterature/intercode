import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import StaffPositionPropType from './StaffPositionPropType';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import { FIELD_TYPES, ModelStateChangeCalculator, StateMutator } from '../FormUtils';

class StaffPositionForm extends React.Component {
  static propTypes = {
    staffPosition: StaffPositionPropType.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    const stateChangeCalculator = new ModelStateChangeCalculator(
      'staffPosition',
      {
        name: FIELD_TYPES.STRING,
        email: FIELD_TYPES.STRING,
        user_con_profiles: FIELD_TYPES.OBJECT,
      },
    );

    this.staffPositionMutator = new StateMutator(
      stateChangeCalculator,
      () => ({ staffPosition: this.props.staffPosition }),
      ({ staffPosition }) => { this.props.onChange(staffPosition); },
    );
  }

  userConProfilesChanged = (newValue) => {
    this.staffPositionMutator.onValueChange(
      'user_con_profiles',
      newValue.map(choice => choice.data),
    );
  }

  render = () => {
    const userConProfileSelectId = this.nextUniqueId();

    return (
      <div>
        <BootstrapFormInput
          name="name"
          label="Position name"
          value={this.props.staffPosition.name || ''}
          onChange={this.staffPositionMutator.onInputChange}
        />

        <BootstrapFormInput
          name="email"
          type="email"
          label="Contact email"
          value={this.props.staffPosition.email || ''}
          onChange={this.staffPositionMutator.onInputChange}
        />

        <div className="form-group">
          <label htmlFor={userConProfileSelectId}>People</label>
          <UserConProfileSelect
            id={userConProfileSelectId}
            multi
            value={this.props.staffPosition.user_con_profiles.map(userConProfile => userConProfile.id)}
            onChange={this.userConProfilesChanged}
          />
        </div>
      </div>
    );
  }
}

export default StaffPositionForm;
