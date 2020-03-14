import React from 'react';
import PropTypes from 'prop-types';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { useChangeDispatchers } from '../ComposableFormUtils';
import UserConProfileSelect from '../BuiltInFormControls/UserConProfileSelect';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';

function ConventionFormEmailSection({
  convention, dispatch, disabled, staffPositions,
}) {
  const [
    changeEventMailingListDomain,
    changeEmailFrom,
    changeCatchAllStaffPosition,
    changeEmailMode,
  ] = useChangeDispatchers(
    dispatch,
    ['event_mailing_list_domain', 'email_from', 'catch_all_staff_position', 'email_mode'],
  );

  return (
    <>
      <BootstrapFormInput
        name="email_from"
        label="Email from"
        value={convention.email_from || ''}
        helpText="Site-generated emails will come from this address."
        onTextChange={changeEmailFrom}
        disabled={disabled}
      />

      <BootstrapFormInput
        name="event_mailing_list_domain"
        label="Event mailing list domain name"
        value={convention.event_mailing_list_domain || ''}
        helpText="If present, event teams can use this domain name to create automatically-managed mailing lists for their team."
        onTextChange={changeEventMailingListDomain}
        disabled={disabled}
      />

      <SelectWithLabel
        label="Catch-all staff position"
        helpText={`If present, email received by any address @${convention.domain}
          that doesn’t match any staff position will be forwarded to this staff position.`}
        options={staffPositions}
        getOptionLabel={(staffPosition) => staffPosition.name}
        getOptionValue={(staffPosition) => staffPosition.id}
        value={convention.catch_all_staff_position}
        onChange={changeCatchAllStaffPosition}
      />

      <MultipleChoiceInput
        caption="Email receiving mode"
        choices={[
          {
            value: 'forward',
            label: `Forward received @${convention.domain} emails to staff as configured`,
          },
          {
            value: 'staff_emails_to_catch_all',
            label: `Forward all @${convention.domain} emails to the catch-all staff position`,
          },
        ]}
        value={convention.email_mode}
        onChange={changeEmailMode}
        disabled={disabled}
      />
    </>
  );
}

ConventionFormEmailSection.propTypes = {
  convention: PropTypes.shape({
    event_mailing_list_domain: PropTypes.string,
    email_from: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ConventionFormEmailSection.defaultProps = {
  disabled: false,
};

export default ConventionFormEmailSection;
