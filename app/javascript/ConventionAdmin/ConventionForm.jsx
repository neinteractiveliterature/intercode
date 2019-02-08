import React from 'react';
import PropTypes from 'prop-types';
import { pluralize } from 'inflected';
import classNames from 'classnames';

import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import { mutator, Transforms } from '../ComposableFormUtils';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import ScheduledValueEditor from '../BuiltInFormControls/ScheduledValueEditor';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import TimezoneSelect from '../BuiltInFormControls/TimezoneSelect';
import CommitableInput from '../BuiltInFormControls/CommitableInput';
import LiquidInput from '../BuiltInFormControls/LiquidInput';

const MAXIMUM_EVENT_SIGNUPS_OPTIONS = [
  ['not_yet', 'No signups yet'],
  ['1', 'Up to 1 event'],
  ['2', 'Up to 2 events'],
  ['3', 'Up to 3 events'],
  ['unlimited', 'Signups fully open'],
  ['not_now', 'Signups frozen'],
];

const buildMaximumEventSignupsInput = (value, onChange) => {
  const processChangeEvent = (event) => {
    onChange(event.target.value);
  };

  const options = MAXIMUM_EVENT_SIGNUPS_OPTIONS.map(([optionValue, label]) => (
    <option key={optionValue} value={optionValue}>{label}</option>
  ));

  return (
    <select className="form-control" value={value} onChange={processChangeEvent}>
      <option />
      {options}
    </select>
  );
};

class ConventionForm extends React.Component {
  static propTypes = {
    initialConvention: PropTypes.shape({
      starts_at: PropTypes.string.isRequired,
      ends_at: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired,
      timezone_name: PropTypes.string.isRequired,
      accepting_proposals: PropTypes.bool.isRequired,
      show_schedule: PropTypes.oneOf(['no', 'priv', 'gms', 'yes']).isRequired,
      show_event_list: PropTypes.oneOf(['no', 'priv', 'gms', 'yes']).isRequired,
      maximum_event_signups: PropTypes.shape({
        timespans: PropTypes.arrayOf(PropTypes.shape({
          start: PropTypes.string,
          finish: PropTypes.string,
          value: PropTypes.string.isRequired,
        }).isRequired).isRequired,
      }).isRequired,
      maximum_tickets: PropTypes.number,
      ticket_name: PropTypes.string.isRequired,
      default_layout: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
      }),
      root_page: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
      }),
      stripe_publishable_key: PropTypes.string,
      masked_stripe_secret_key: PropTypes.string,
      clickwrap_agreement: PropTypes.string,
    }).isRequired,
    cmsLayouts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    pages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    saveConvention: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      convention: props.initialConvention,
    };

    this.mutator = mutator({
      component: this,
      transforms: {
        convention: {
          name: Transforms.textInputChange,
          domain: Transforms.textInputChange,
          event_mailing_list_domain: Transforms.textInputChange,
          timezone_name: Transforms.identity,
          starts_at: Transforms.datetime,
          ends_at: Transforms.datetime,
          accepting_proposals: Transforms.identity,
          show_schedule: Transforms.identity,
          show_event_list: Transforms.identity,
          maximum_event_signups: Transforms.identity,
          maximum_tickets: Transforms.inputChange(Transforms.integer),
          ticket_name: Transforms.textInputChange,
          default_layout: Transforms.identity,
          root_page: Transforms.identity,
          stripe_publishable_key: Transforms.identity,
          stripe_secret_key: Transforms.identity,
          clickwrap_agreement: Transforms.identity,
        },
      },
    });
  }

  onClickSave = (event) => {
    event.preventDefault();
    this.props.saveConvention(this.state.convention);
  }

  renderBooleanInput = (name, caption) => (
    <BooleanInput
      name={name}
      caption={caption}
      value={this.state.convention[name]}
      onChange={this.mutator.convention[name]}
    />
  )

  render = () => {
    const startEndFields = [['starts_at', 'Convention starts'], ['ends_at', 'Convention ends']].map(([name, label]) => (
      <div className="col-md-6" key={name}>
        {label}
        <DateTimeInput
          value={this.state.convention[name]}
          timezoneName={this.state.convention.timezone_name}
          onChange={this.mutator.convention[name]}
        />
      </div>
    ));

    return (
      <form>
        <BootstrapFormInput
          name="name"
          label="Name"
          value={this.state.convention.name || ''}
          onChange={this.mutator.convention.name}
        />

        <BootstrapFormInput
          name="domain"
          label="Convention domain name"
          value={this.state.convention.domain || ''}
          onChange={this.mutator.convention.domain}
        />

        <BootstrapFormInput
          name="event_mailing_list_domain"
          label="Event mailing list domain name"
          value={this.state.convention.event_mailing_list_domain || ''}
          helpText="If present, event teams can use this domain name to create automatically-managed mailing lists for their team."
          onChange={this.mutator.convention.event_mailing_list_domain}
        />

        <div className="form-group">
          <label htmlFor="stripe_publishable_key">Stripe publishable key</label>
          <CommitableInput
            value={this.state.convention.stripe_publishable_key || ''}
            onChange={this.mutator.convention.stripe_publishable_key}
            renderInput={props => (
              <input
                id="stripe_publishable_key"
                {...props}
                className={classNames(props.className, 'text-monospace', { 'bg-warning-light': props.onFocus != null })}
              />
            )}
          />
        </div>

        <div className="form-group">
          <label htmlFor="stripe_secret_key">Stripe secret key</label>
          <CommitableInput
            value={this.state.convention.stripe_secret_key || ''}
            onChange={this.mutator.convention.stripe_secret_key}
            renderInput={props => (
              <input
                id="stripe_secret_key"
                {...props}
                className={classNames(props.className, 'text-monospace', { 'bg-warning-light': props.onFocus != null })}
                value={
                  props.onFocus
                    ? (props.value || this.props.initialConvention.masked_stripe_secret_key)
                    : props.value
                }
              />
            )}
          />
        </div>

        <TimezoneSelect
          name="timezone_name"
          label="Time zone"
          value={this.state.convention.timezone_name}
          onChange={this.mutator.convention.timezone_name}
        />

        <div className="row form-group">
          {startEndFields}
        </div>

        <SelectWithLabel
          name="default_layout_id"
          label="Default layout for pages"
          value={this.state.convention.default_layout}
          isClearable
          getOptionValue={option => option.id}
          getOptionLabel={option => option.name}
          options={this.props.cmsLayouts}
          onChange={this.mutator.convention.default_layout}
        />

        <SelectWithLabel
          name="root_page_id"
          label="Root page"
          value={this.state.convention.root_page}
          isClearable
          getOptionValue={option => option.id}
          getOptionLabel={option => option.name}
          options={this.props.pages}
          onChange={this.mutator.convention.root_page}
        />

        {this.renderBooleanInput('accepting_proposals', 'Accepting event proposals')}

        <MultipleChoiceInput
          name="show_event_list"
          caption="Show list of events"
          choices={[
            { value: 'no', label: 'No' },
            { value: 'priv', label: 'Only to users with scheduling privileges' },
            { value: 'gms', label: 'Only to event team members and users with any privileges' },
            { value: 'yes', label: 'Yes, to everyone' },
          ]}
          value={this.state.convention.show_event_list}
          onChange={this.mutator.convention.show_event_list}
        />

        <MultipleChoiceInput
          name="show_schedule"
          caption="Show event schedule"
          choices={[
            { value: 'no', label: 'No' },
            { value: 'priv', label: 'Only to users with scheduling privileges' },
            { value: 'gms', label: 'Only to event team members and users with any privileges' },
            { value: 'yes', label: 'Yes, to everyone' },
          ]}
          value={this.state.convention.show_schedule}
          onChange={this.mutator.convention.show_schedule}
        />

        <BootstrapFormInput
          name="ticket_name"
          label={'Name for "ticket" at this convention'}
          type="text"
          value={this.state.convention.ticket_name || ''}
          onChange={this.mutator.convention.ticket_name}
        />

        <BootstrapFormInput
          name="maximum_tickets"
          label={`Maximum ${pluralize(this.state.convention.ticket_name)}`}
          type="number"
          value={(this.state.convention.maximum_tickets || '').toString()}
          onChange={this.mutator.convention.maximum_tickets}
        />

        <fieldset>
          <legend className="col-form-label">Event signup schedule</legend>
          <ScheduledValueEditor
            scheduledValue={this.state.convention.maximum_event_signups}
            timezone={this.state.convention.timezone_name}
            setScheduledValue={this.mutator.convention.maximum_event_signups}
            buildValueInput={buildMaximumEventSignupsInput}
          />
        </fieldset>

        <fieldset className="mb-4">
          <legend className="col-form-label">
            Clickwrap agreement (if present, all users will be prompted to accept this agreement
            before using the site)
          </legend>
          <LiquidInput
            value={this.state.convention.clickwrap_agreement}
            onChange={this.mutator.convention.clickwrap_agreement}
          />
        </fieldset>

        <button className="btn btn-primary" onClick={this.onClickSave} type="button">
          Save settings
        </button>
      </form>
    );
  }
}

export default ConventionForm;
