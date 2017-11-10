import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ResourceForm from './ResourceForm';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import { FIELD_TYPES, ModelStateChangeCalculator } from '../FormUtils';

class StaffPositionForm extends React.Component {
  static propTypes = {
    baseUrl: PropTypes.string.isRequired,
    initialStaffPosition: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
      user_con_profile_ids: PropTypes.arrayOf(PropTypes.number.isRequired),
    }),
  };

  static defaultProps = {
    initialStaffPosition: {
      id: null,
      name: null,
      email: null,
      user_con_profile_ids: [],
    },
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      staffPosition: { ...this.props.initialStaffPosition },
    };

    this.staffPositionMutator = new ModelStateChangeCalculator(
      'staffPosition',
      {
        name: FIELD_TYPES.STRING,
        email: FIELD_TYPES.STRING,
        user_con_profile_ids: FIELD_TYPES.SELECT_MULTIPLE,
      },
    ).getMutatorForComponent(this);
  }

  getSubmitRequestBody = () => ({
    staff_position: this.state.staffPosition,
  })

  render = () => {
    const userConProfileSelectId = this.nextUniqueId();

    return (
      <ResourceForm
        baseUrl={this.props.baseUrl}
        resourceId={this.state.staffPosition.id}
        getSubmitRequestBody={this.getSubmitRequestBody}
        submitText="Save staff position"
      >
        <BootstrapFormInput
          name="name"
          label="Position name"
          value={this.state.staffPosition.name || ''}
          onChange={this.staffPositionMutator.onInputChange}
        />

        <BootstrapFormInput
          name="email"
          type="email"
          label="Contact email"
          value={this.state.staffPosition.email || ''}
          onChange={this.staffPositionMutator.onInputChange}
        />

        <div className="form-group">
          <label htmlFor={userConProfileSelectId}>People</label>
          <UserConProfileSelect
            id={userConProfileSelectId}
            multi
            value={this.state.staffPosition.user_con_profile_ids || []}
            onChange={this.staffPositionMutator.valueChangeCallback('user_con_profile_ids')}
          />
        </div>
      </ResourceForm>
    );
  }
}

export default StaffPositionForm;
