import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import Form from '../Models/Form';
import SinglePageFormPresenter from '../FormPresenter/SinglePageFormPresenter';

export const buildRegistrationPolicyForVolunteerEvent = totalSlots => ({
  buckets: [
    {
      key: 'signups',
      name: 'Signups',
      description: 'Signups for this event',
      anything: false,
      slots_limited: true,
      minimum_slots: 1,
      preferred_slots: totalSlots,
      total_slots: totalSlots,
    },
  ],
});

const CommonEventFormFieldsWithRefForwarding = forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function CommonEventFormFields({
    event, formResponseValuesChanged, form, convention, children,
  }, ref) {
    return (
      <SinglePageFormPresenter
        form={form}
        convention={convention}
        response={event.form_response_attrs}
        responseValuesChanged={formResponseValuesChanged}
        ref={ref}
      >
        {children}
      </SinglePageFormPresenter>
    );
  },
);

CommonEventFormFieldsWithRefForwarding.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number,
    form_response_attrs: PropTypes.shape({}).isRequired,
    maximum_event_provided_tickets_overrides: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  formResponseValuesChanged: PropTypes.func.isRequired,
  form: Form.propType.isRequired,
  convention: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
};

CommonEventFormFieldsWithRefForwarding.defaultProps = {
  children: null,
};

export default CommonEventFormFieldsWithRefForwarding;

