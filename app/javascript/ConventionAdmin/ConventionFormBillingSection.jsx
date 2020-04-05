import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pluralize, capitalize } from 'inflected';

import { useChangeDispatchers } from '../ComposableFormUtils';
import CommitableInput from '../BuiltInFormControls/CommitableInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';

function ConventionFormBillingSection({
  convention, dispatch, maskedStripeSecretKey, disabled,
}) {
  const [
    changeStripePublishableKey, changeStripeSecretKey, changeTicketName, changeMaximumTickets,
    changeTicketMode,
  ] = useChangeDispatchers(
    dispatch,
    [
      'stripe_publishable_key', 'stripe_secret_key', 'ticket_name', 'maximum_tickets',
      'ticket_mode',
    ],
  );

  return (
    <>
      <div className="form-group">
        <label htmlFor="stripe_publishable_key">Stripe publishable key</label>
        <CommitableInput
          value={convention.stripe_publishable_key || ''}
          onChange={changeStripePublishableKey}
          renderInput={({ onChange, ...inputProps }) => (
            <input
              id="stripe_publishable_key"
              {...inputProps}
              onChange={(event) => onChange(event.target.value)}
              className={classNames(
                inputProps.className,
                'text-monospace',
                { 'bg-warning-light': inputProps.onFocus != null },
              )}
              disabled={disabled}
            />
          )}
        />
      </div>

      <div className="form-group">
        <label htmlFor="stripe_secret_key">Stripe secret key</label>
        <CommitableInput
          value={convention.stripe_secret_key || ''}
          onChange={changeStripeSecretKey}
          renderInput={({ onChange, ...inputProps }) => (
            <input
              id="stripe_secret_key"
              {...inputProps}
              onChange={(event) => onChange(event.target.value)}
              className={classNames(
                inputProps.className,
                'text-monospace',
                { 'bg-warning-light': inputProps.onFocus != null },
              )}
              value={
                inputProps.onFocus
                  ? (inputProps.value || maskedStripeSecretKey)
                  : inputProps.value
              }
              disabled={disabled}
            />
          )}
        />
      </div>

      <MultipleChoiceInput
        caption={`${capitalize(convention.ticket_name)} sales`}
        choices={[
          {
            value: 'disabled',
            label: `Convention does not sell ${pluralize(convention.ticket_name)}`,
          },
          {
            value: 'required_for_signup',
            label: `${pluralize(capitalize(convention.ticket_name))} are sold and required for event signups`,
          },
        ]}
        value={convention.ticket_mode}
        onChange={changeTicketMode}
        disabled={disabled}
      />

      <BootstrapFormInput
        name="ticket_name"
        label={'Name for "ticket" at this convention'}
        type="text"
        value={convention.ticket_name || ''}
        onTextChange={changeTicketName}
        disabled={disabled || convention.ticket_mode === 'disabled'}
      />

      <BootstrapFormInput
        name="maximum_tickets"
        label={`Maximum ${pluralize(convention.ticket_name)}`}
        type="number"
        value={(convention.maximum_tickets || '').toString()}
        onTextChange={changeMaximumTickets}
        disabled={disabled || convention.ticket_mode === 'disabled'}
      />
    </>
  );
}

ConventionFormBillingSection.propTypes = {
  convention: PropTypes.shape({
    stripe_publishable_key: PropTypes.string,
    stripe_secret_key: PropTypes.string,
    ticket_name: PropTypes.string,
    maximum_tickets: PropTypes.number,
    ticket_mode: PropTypes.oneOf(['disabled', 'required_for_signup']),
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  maskedStripeSecretKey: PropTypes.string,
  disabled: PropTypes.bool,
};

ConventionFormBillingSection.defaultProps = {
  maskedStripeSecretKey: '',
  disabled: false,
};

export default ConventionFormBillingSection;
