import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';
import { mutator, Transforms } from '../../ComposableFormUtils';
import RequiredIndicator from './RequiredIndicator';
import EmailAliasInput from '../../BuiltInFormControls/EmailAliasInput';
import FormGroupWithLabel from '../../BuiltInFormControls/FormGroupWithLabel';

function EventEmailInput({
  convention, value, formItem, onChange, onInteract, valueInvalid,
}) {
  const [emailBehavior, setEmailBehavior] = useState(() => {
    const teamMailingListName = (value || {}).team_mailing_list_name;
    return (
      teamMailingListName && convention.event_mailing_list_domain
        ? 'team_mailing_list'
        : (value || {}).con_mail_destination
    );
  });
  const userDidInteract = useCallback(
    () => onInteract(formItem.identifier),
    [formItem.identifier, onInteract],
  );

  const valueMutator = mutator({
    getState: () => value,
    setState: (state) => {
      userDidInteract();
      if (emailBehavior === 'team_mailing_list') {
        onChange({
          ...state,
          email: (state.team_mailing_list_name && state.team_mailing_list_name.trim() !== '')
            ? `${state.team_mailing_list_name}@${convention.event_mailing_list_domain}`
            : null,
        });
      } else {
        onChange({
          ...state,
          team_mailing_list_name: null,
        });
      }
    },
    transforms: {
      team_mailing_list_name: Transforms.identity,
      email: Transforms.identity,
    },
  });

  const emailBehaviorChanged = (newBehavior) => {
    setEmailBehavior(newBehavior);
    if (newBehavior === 'team_mailing_list' && convention.event_mailing_list_domain) {
      onChange({
        ...(value || {}),
        con_mail_destination: 'event_email',
      });
    } else {
      onChange({
        ...(value || {}),
        con_mail_destination: emailBehavior,
        team_mailing_list_name: null,
      });
    }
    userDidInteract();
  };

  const renderEmailInput = () => {
    if (emailBehavior === 'team_mailing_list') {
      return (
        <FormGroupWithLabel
          name="team-mailing-list-name"
          label={(
            <>
              Mailing list address
              <RequiredIndicator formItem={formItem} />
            </>
          )}
        >
          {(id) => (
            <EmailAliasInput
              value={(value || {}).team_mailing_list_name}
              onTextChange={valueMutator.team_mailing_list_name}
              id={id}
              aria-label="Mailing list address (portion before @ sign)"
              domain={convention.event_mailing_list_domain}
            />
          )}
        </FormGroupWithLabel>
      );
    }

    return (
      <BootstrapFormInput
        label={(
          <>
            Contact email address
            <RequiredIndicator formItem={formItem} />
          </>
        )}
        name={`${formItem.identifier}.email`}
        value={(value || {}).email || ''}
        onTextChange={valueMutator.email}
        disabled={emailBehavior == null}
      />
    );
  };

  return (
    <fieldset className="form-group">
      <div className={classNames({ 'border-0': !valueInvalid, 'border rounded border-danger': valueInvalid })}>
        <legend className="col-form-label">
          <span>How would you like to receive email about this event?</span>
          <RequiredIndicator formItem={formItem} />
        </legend>
        <ChoiceSet
          name={formItem.identifier}
          choices={[
            ...(
              convention.event_mailing_list_domain
                ? [{ label: 'Have the convention create and manage a team mailing list for me', value: 'team_mailing_list' }]
                : []
            ),
            { label: 'Use a contact email I specify', value: 'event_email' },
            { label: 'Specify a contact email for attendees, but have the convention email individual team members with updates', value: 'gms' },
          ]}
          value={emailBehavior}
          onChange={emailBehaviorChanged}
        />
        <div className="mt-4">
          {renderEmailInput()}
        </div>
        {
          valueInvalid
            ? (
              <span className="text-danger">
                This field is required.
              </span>
            )
            : null
        }
      </div>
    </fieldset>
  );
}

EventEmailInput.propTypes = {
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
};

EventEmailInput.defaultProps = {
  value: null,
  valueInvalid: false,
};

export default EventEmailInput;
