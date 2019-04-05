import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import Form from '../Models/Form';
import MaximumEventProvidedTicketsOverrideEditor from '../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
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

const processFormResponseValue = (key, value) => {
  switch (key) {
    case 'can_play_concurrently':
      return { can_play_concurrently: (value === 'true') };
    case 'total_slots':
      return {
        total_slots: value,
        registration_policy: buildRegistrationPolicyForVolunteerEvent(Number.parseInt(value, 10)),
      };
    default:
      return { [key]: value };
  }
};

function CommonEventFormFields({
  event, canOverrideMaximumEventProvidedTickets, ticketTypes, ticketName, onChange, form,
  convention, createMaximumEventProvidedTicketsOverride, deleteMaximumEventProvidedTicketsOverride,
  updateMaximumEventProvidedTicketsOverride, children,
}, ref) {
  const formResponseValuesChanged = useCallback(
    (newResponseValues) => {
      const processedResponseValues = Object.entries(newResponseValues).reduce(
        (processed, [key, value]) => ({
          ...processed,
          ...processFormResponseValue(key, value),
        }),
        {},
      );

      onChange({
        ...event,
        form_response_attrs: {
          ...event.form_response_attrs,
          ...processedResponseValues,
        },
      });
    },
    [event, onChange],
  );

  const renderMaximumEventProvidedTicketsOverrideEditor = useCallback(
    () => {
      if (!canOverrideMaximumEventProvidedTickets) {
        return null;
      }

      return (
        <MaximumEventProvidedTicketsOverrideEditor
          eventId={event.id}
          ticketTypes={ticketTypes}
          ticketName={ticketName}
          overrides={event.maximum_event_provided_tickets_overrides}
          createOverride={createMaximumEventProvidedTicketsOverride}
          deleteOverride={deleteMaximumEventProvidedTicketsOverride}
          updateOverride={updateMaximumEventProvidedTicketsOverride}
        />
      );
    },
    [
      canOverrideMaximumEventProvidedTickets, event, ticketTypes, ticketName,
      createMaximumEventProvidedTicketsOverride, deleteMaximumEventProvidedTicketsOverride,
      updateMaximumEventProvidedTicketsOverride,
    ],
  );

  return (
    <SinglePageFormPresenter
      form={form}
      convention={convention}
      response={event.form_response_attrs}
      responseValuesChanged={formResponseValuesChanged}
      ref={ref}
    >

      {renderMaximumEventProvidedTicketsOverrideEditor()}

      {children}
    </SinglePageFormPresenter>
  );
}

const CommonEventFormFieldsWithRefForwarding = forwardRef(CommonEventFormFields);

CommonEventFormFieldsWithRefForwarding.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number,
    form_response_attrs: PropTypes.shape({}).isRequired,
    maximum_event_provided_tickets_overrides: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  canOverrideMaximumEventProvidedTickets: PropTypes.bool,
  ticketTypes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    maximum_event_provided_tickets: PropTypes.number.isRequired,
  }).isRequired).isRequired,
  ticketName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  form: Form.propType.isRequired,
  convention: PropTypes.shape({}).isRequired,
  createMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
  deleteMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
  updateMaximumEventProvidedTicketsOverride: PropTypes.func.isRequired,
  children: PropTypes.node,
};

CommonEventFormFieldsWithRefForwarding.defaultProps = {
  canOverrideMaximumEventProvidedTickets: false,
  ticketName: null,
  children: null,
};

export default CommonEventFormFieldsWithRefForwarding;

