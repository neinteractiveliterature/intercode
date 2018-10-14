import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';

import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { stateUpdater, combineStateChangeCalculators, Transforms } from '../ComposableFormUtils';
import UserSelect from '../BuiltInFormControls/UserSelect';

class UserActivityAlertForm extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    userActivityAlert: PropTypes.shape({
      id: PropTypes.number.isRequired,
      partial_name: PropTypes.string,
      email: PropTypes.string,
      user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
      trigger_on_ticket_create: PropTypes.bool,
      trigger_on_user_con_profile_create: PropTypes.bool,
    }).isRequired,
    convention: PropTypes.shape({
      ticket_name: PropTypes.string.isRequired,
    }),
  }

  constructor(props) {
    super(props);

    enableUniqueIds(this);

    this.stateUpdater = stateUpdater(
      () => this.props.userActivityAlert,
      this.props.onChange,
      combineStateChangeCalculators({
        partial_name: Transforms.textInputChange,
        email: Transforms.textInputChange,
        user: Transforms.identity,
        trigger_on_user_con_profile_create: Transforms.checkboxChange,
        trigger_on_ticket_create: Transforms.checkboxChange,
      }),
    );
  }

  render = () => (
    <React.Fragment>
      <div className="card">
        <div className="card-header">
          Matching
        </div>

        <div className="card-body">
          <BootstrapFormInput
            name="partial_name"
            label="Partial name"
            helpText="If any part of the user's name matches this string, the alert will match.  Case insensitive."
            value={this.props.userActivityAlert.partial_name || ''}
            onChange={this.stateUpdater.partial_name}
          />

          <BootstrapFormInput
            name="email"
            type="email"
            label="Email"
            helpText="If the user's email address matches this string, the alert will match.  Case insensitive.  Ignores dots before the @ and any text following a + sign."
            value={this.props.userActivityAlert.email || ''}
            onChange={this.stateUpdater.email}
          />

          <div className="form-group">
            <label htmlFor={this.nextUniqueId()}>User account</label>
            <UserSelect
              id={this.lastUniqueId()}
              value={this.props.userActivityAlert.user}
              onChange={this.stateUpdater.user}
            />
            <small className="form-text text-muted">Matches across all conventions using this server.</small>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          Trigger events
        </div>

        <div className="card-body">
          <BootstrapFormCheckbox
            name="trigger_on_user_con_profile_create"
            label="Trigger on profile creation"
            type="checkbox"
            checked={this.props.userActivityAlert.trigger_on_user_con_profile_create}
            onChange={this.stateUpdater.trigger_on_user_con_profile_create}
          />

          <BootstrapFormCheckbox
            name="trigger_on_ticket_create"
            label={`Trigger on ${this.props.convention.ticket_name} creation`}
            type="checkbox"
            checked={this.props.userActivityAlert.trigger_on_ticket_create}
            onChange={this.stateUpdater.trigger_on_ticket_create}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserActivityAlertForm;
