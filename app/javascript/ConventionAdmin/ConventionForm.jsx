import React, { useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { pluralize } from 'inflected';
import classNames from 'classnames';
import { mapValues } from 'lodash';

import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import { Transforms, transformsReducer } from '../ComposableFormUtils';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import ScheduledValueEditor from '../BuiltInFormControls/ScheduledValueEditor';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import TimezoneSelect from '../BuiltInFormControls/TimezoneSelect';
import CommitableInput from '../BuiltInFormControls/CommitableInput';
import LiquidInput from '../BuiltInFormControls/LiquidInput';

export const MAXIMUM_EVENT_SIGNUPS_OPTIONS = [
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

const conventionFormTransforms = {
  name: Transforms.identity,
  domain: Transforms.identity,
  event_mailing_list_domain: Transforms.identity,
  timezone_name: Transforms.identity,
  starts_at: Transforms.datetime,
  ends_at: Transforms.datetime,
  accepting_proposals: Transforms.identity,
  show_schedule: Transforms.identity,
  show_event_list: Transforms.identity,
  maximum_event_signups: Transforms.identity,
  maximum_tickets: Transforms.integer,
  ticket_name: Transforms.identity,
  default_layout: Transforms.identity,
  root_page: Transforms.identity,
  stripe_publishable_key: Transforms.identity,
  stripe_secret_key: Transforms.identity,
  clickwrap_agreement: Transforms.identity,
};

const conventionFormReducer = transformsReducer(conventionFormTransforms);

function ConventionForm({
  initialConvention, cmsLayouts, pages, saveConvention,
}) {
  const [convention, dispatch] = useReducer(conventionFormReducer, initialConvention);
  const fieldSetters = mapValues(conventionFormTransforms, (transform, key) => (
    value => dispatch({ type: 'change', key, value })));

  const onClickSave = useCallback(
    (event) => {
      event.preventDefault();
      saveConvention(convention);
    },
    [convention, saveConvention],
  );

  const renderBooleanInput = (name, caption) => (
    <BooleanInput
      name={name}
      caption={caption}
      value={convention[name]}
      onChange={fieldSetters[name]}
    />
  );

  const startEndFields = [['starts_at', 'Convention starts'], ['ends_at', 'Convention ends']].map(([name, label]) => (
    <div className="col-md-6" key={name}>
      {label}
      <DateTimeInput
        value={convention[name]}
        timezoneName={convention.timezone_name}
        onChange={fieldSetters[name]}
      />
    </div>
  ));

  return (
    <form>
      <BootstrapFormInput
        name="name"
        label="Name"
        value={convention.name || ''}
        onTextChange={fieldSetters.name}
      />

      <BootstrapFormInput
        name="domain"
        label="Convention domain name"
        value={convention.domain || ''}
        onTextChange={fieldSetters.domain}
      />

      <BootstrapFormInput
        name="event_mailing_list_domain"
        label="Event mailing list domain name"
        value={convention.event_mailing_list_domain || ''}
        helpText="If present, event teams can use this domain name to create automatically-managed mailing lists for their team."
        onTextChange={fieldSetters.event_mailing_list_domain}
      />

      <div className="form-group">
        <label htmlFor="stripe_publishable_key">Stripe publishable key</label>
        <CommitableInput
          value={convention.stripe_publishable_key || ''}
          onChange={fieldSetters.stripe_publishable_key}
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
          value={convention.stripe_secret_key || ''}
          onChange={fieldSetters.stripe_secret_key}
          renderInput={props => (
            <input
              id="stripe_secret_key"
              {...props}
              className={classNames(props.className, 'text-monospace', { 'bg-warning-light': props.onFocus != null })}
              value={
                props.onFocus
                  ? (props.value || initialConvention.masked_stripe_secret_key)
                  : props.value
              }
            />
          )}
        />
      </div>

      <TimezoneSelect
        name="timezone_name"
        label="Time zone"
        value={convention.timezone_name}
        onChange={fieldSetters.timezone_name}
      />

      <div className="row form-group">
        {startEndFields}
      </div>

      <SelectWithLabel
        name="default_layout_id"
        label="Default layout for pages"
        value={convention.default_layout}
        isClearable
        getOptionValue={option => option.id}
        getOptionLabel={option => option.name}
        options={cmsLayouts}
        onChange={fieldSetters.default_layout}
      />

      <SelectWithLabel
        name="root_page_id"
        label="Root page"
        value={convention.root_page}
        isClearable
        getOptionValue={option => option.id}
        getOptionLabel={option => option.name}
        options={pages}
        onChange={fieldSetters.root_page}
      />

      {renderBooleanInput('accepting_proposals', 'Accepting event proposals')}

      <MultipleChoiceInput
        name="show_event_list"
        caption="Show list of events"
        choices={[
          { value: 'no', label: 'No' },
          { value: 'priv', label: 'Only to users with scheduling privileges' },
          { value: 'gms', label: 'Only to event team members and users with any privileges' },
          { value: 'yes', label: 'Yes, to everyone' },
        ]}
        value={convention.show_event_list}
        onChange={fieldSetters.show_event_list}
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
        value={convention.show_schedule}
        onChange={fieldSetters.show_schedule}
      />

      <BootstrapFormInput
        name="ticket_name"
        label={'Name for "ticket" at this convention'}
        type="text"
        value={convention.ticket_name || ''}
        onTextChange={fieldSetters.ticket_name}
      />

      <BootstrapFormInput
        name="maximum_tickets"
        label={`Maximum ${pluralize(convention.ticket_name)}`}
        type="number"
        value={(convention.maximum_tickets || '').toString()}
        onTextChange={fieldSetters.maximum_tickets}
      />

      <fieldset>
        <legend className="col-form-label">Event signup schedule</legend>
        <ScheduledValueEditor
          scheduledValue={convention.maximum_event_signups}
          timezone={convention.timezone_name}
          setScheduledValue={fieldSetters.maximum_event_signups}
          buildValueInput={buildMaximumEventSignupsInput}
        />
      </fieldset>

      <fieldset className="mb-4">
        <legend className="col-form-label">
          Clickwrap agreement (if present, all users will be prompted to accept this agreement
          before using the site)
        </legend>
        <LiquidInput
          value={convention.clickwrap_agreement}
          onChange={fieldSetters.clickwrap_agreement}
        />
      </fieldset>

      <button className="btn btn-primary" onClick={onClickSave} type="button">
        Save settings
      </button>
    </form>
  );
}

ConventionForm.propTypes = {
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
};

export default ConventionForm;
