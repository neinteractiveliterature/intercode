import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { enableUniqueIds } from 'react-html-id';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';
import { mutator, Transforms } from '../../ComposableFormUtils';
import RequiredIndicator from './RequiredIndicator';

class EventEmailInput extends React.Component {
  static propTypes = {
    convention: PropTypes.shape({
      event_mailing_list_domain: PropTypes.string,
    }).isRequired,
    formItem: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
    }).isRequired,
    value: PropTypes.shape({
      con_mail_destination: PropTypes.oneOf(['event_email', 'gms']),
      email: PropTypes.string,
      team_mailing_list_name: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    onInteract: PropTypes.func.isRequired,
    valueInvalid: PropTypes.bool,
  }

  static defaultProps = {
    value: null,
    valueInvalid: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      emailBehavior: (
        (this.props.value || {}).team_mailing_list_name && this.props.convention.event_mailing_list_domain
          ? 'team_mailing_list'
          : (this.props.value || {}).con_mail_destination
      ),
    };

    this.valueMutator = mutator({
      getState: () => this.props.value,
      setState: (state) => {
        this.userDidInteract();
        if (this.state.emailBehavior === 'team_mailing_list') {
          this.props.onChange({
            ...state,
            email: (state.team_mailing_list_name && state.team_mailing_list_name.trim() !== '')
              ? `${state.team_mailing_list_name}@${this.props.convention.event_mailing_list_domain}`
              : null,
          });
        } else {
          this.props.onChange({
            ...state,
            team_mailing_list_name: null,
          });
        }
      },
      transforms: {
        team_mailing_list_name: Transforms.textInputChange,
        email: Transforms.textInputChange,
      },
    });

    enableUniqueIds(this);
  }

  emailBehaviorChanged = (emailBehavior) => {
    this.setState({ emailBehavior });
    if (emailBehavior === 'team_mailing_list' && this.props.convention.event_mailing_list_domain) {
      this.props.onChange({
        ...(this.props.value || {}),
        con_mail_destination: 'event_email',
      });
    } else {
      this.props.onChange({
        ...(this.props.value || {}),
        con_mail_destination: emailBehavior,
        team_mailing_list_name: null,
      });
    }
    this.userDidInteract();
  }

  userDidInteract = () => {
    this.props.onInteract(this.props.formItem.identifier);
  }

  renderEmailInput = () => {
    if (this.state.emailBehavior === 'team_mailing_list') {
      const inputId = this.nextUniqueId();

      return (
        <div className="form-group">
          <label htmlFor={inputId}>
            Mailing list address
            <RequiredIndicator formItem={this.props.formItem} />
          </label>
          <div className="input-group">
            <input
              className="form-control"
              value={(this.props.value || {}).team_mailing_list_name}
              onChange={this.valueMutator.team_mailing_list_name}
            />
            <div className="input-group-append">
              <span className="input-group-text">
                @
                {this.props.convention.event_mailing_list_domain}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <BootstrapFormInput
        label={(
          <React.Fragment>
            Contact email address
            <RequiredIndicator formItem={this.props.formItem} />
          </React.Fragment>
        )}
        name={`${this.props.formItem.identifier}.email`}
        value={(this.props.value || {}).email || ''}
        onChange={this.valueMutator.email}
        disabled={this.state.emailBehavior == null}
      />
    );
  }

  render = () => (
    <fieldset className="form-group">
      <div className={classNames({ 'border-0': !this.props.valueInvalid, 'border rounded border-danger': this.props.valueInvalid })}>
        <legend className="col-form-label">
          <span>How would you like to receive email about this event?</span>
          <RequiredIndicator formItem={this.props.formItem} />
        </legend>
        <ChoiceSet
          name={this.props.formItem.identifier}
          choices={[
            ...(
              this.props.convention.event_mailing_list_domain
                ? [{ label: 'Have the convention create and manage a team mailing list for me', value: 'team_mailing_list' }]
                : []
            ),
            { label: 'Use a contact email I specify', value: 'event_email' },
            { label: 'Specify a contact email for attendees, but have the convention email individual team members with updates', value: 'gms' },
          ]}
          value={this.state.emailBehavior}
          onChange={this.emailBehaviorChanged}
        />
        <div className="mt-4">
          {this.renderEmailInput()}
        </div>
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

export default EventEmailInput;
