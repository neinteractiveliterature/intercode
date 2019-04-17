import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pluralize } from 'inflected';

import { useChangeDispatchers } from '../ComposableFormUtils';
import CommitableInput from '../BuiltInFormControls/CommitableInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';

function ConventionFormBillingSection({ convention, dispatch, maskedStripeSecretKey }) {
  const [
    changeStripePublishableKey, changeStripeSecretKey, changeTicketName, changeMaximumTickets,
  ] = useChangeDispatchers(
    dispatch,
    ['stripe_publishable_key', 'stripe_secret_key', 'ticket_name', 'maximum_tickets'],
  );

  return (
    <>
      <div className="form-group">
        <label htmlFor="stripe_publishable_key">Stripe publishable key</label>
        <CommitableInput
          value={convention.stripe_publishable_key || ''}
          onChange={changeStripePublishableKey}
          renderInput={inputProps => (
            <input
              id="stripe_publishable_key"
              {...inputProps}
              className={classNames(
                inputProps.className,
                'text-monospace',
                { 'bg-warning-light': inputProps.onFocus != null },
              )}
            />
          )}
        />
      </div>

      <div className="form-group">
        <label htmlFor="stripe_secret_key">Stripe secret key</label>
        <CommitableInput
          value={convention.stripe_secret_key || ''}
          onChange={changeStripeSecretKey}
          renderInput={inputProps => (
            <input
              id="stripe_secret_key"
              {...inputProps}
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
            />
          )}
        />
      </div>

      <BootstrapFormInput
        name="ticket_name"
        label={'Name for "ticket" at this convention'}
        type="text"
        value={convention.ticket_name || ''}
        onTextChange={changeTicketName}
      />

      <BootstrapFormInput
        name="maximum_tickets"
        label={`Maximum ${pluralize(convention.ticket_name)}`}
        type="number"
        value={(convention.maximum_tickets || '').toString()}
        onTextChange={changeMaximumTickets}
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
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  maskedStripeSecretKey: PropTypes.string,
};

ConventionFormBillingSection.defaultProps = {
  maskedStripeSecretKey: '',
};

export default ConventionFormBillingSection;
