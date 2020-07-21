import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'inflected';
import { useTranslation } from 'react-i18next';

import ErrorDisplay from '../ErrorDisplay';
import InPlaceEditor from './InPlaceEditor';
import { parseIntOrNull } from '../ComposableFormUtils';
import useAsyncFunction from '../useAsyncFunction';
import { sortByLocaleString } from '../ValueUtils';
import { useConfirm } from '../ModalDialogs/Confirm';

const TicketTypePropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  maximum_event_provided_tickets: PropTypes.number.isRequired,
});

const NULL_TICKET_TYPE = {
  id: '',
  description: '',
  maximum_event_provided_tickets: '',
};

function MaximumEventProvidedTicketsOverrideEditor({
  eventId, ticketName, overrides, ticketTypes, createOverride, updateOverride, deleteOverride,
}) {
  const { t } = useTranslation();
  const [createOverrideAsync, createError, , clearCreateError] = useAsyncFunction(createOverride);
  const [updateOverrideAsync, updateError, , clearUpdateError] = useAsyncFunction(updateOverride);
  const [deleteOverrideAsync, deleteError, , clearDeleteError] = useAsyncFunction(deleteOverride);
  const [addingOverride, setAddingOverride] = useState({
    ticket_type: NULL_TICKET_TYPE,
    override_value: null,
  });
  const confirm = useConfirm();
  const clearAllErrors = () => {
    clearCreateError();
    clearUpdateError();
    clearDeleteError();
  };

  const sortedOverrides = useMemo(
    () => sortByLocaleString(overrides, (o) => o.ticket_type.description),
    [overrides],
  );

  const sortedTicketTypes = useMemo(
    () => sortByLocaleString(ticketTypes, (tt) => tt.description),
    [ticketTypes],
  );

  const unoverriddenTicketTypes = useMemo(
    () => sortedTicketTypes.filter((ticketType) => (
      overrides.every((override) => override.ticket_type.id !== ticketType.id))),
    [overrides, sortedTicketTypes],
  );

  const addingOverrideDataComplete = (
    addingOverride.ticket_type.id
    && addingOverride.override_value != null
  );

  const addingTicketTypeIdDidChange = (event) => {
    const newTicketType = ticketTypes.find((
      (ticketType) => ticketType.id.toString() === event.target.value
    ));

    if (newTicketType == null) {
      setAddingOverride((prevAddingOverride) => ({
        ...prevAddingOverride,
        ticket_type: NULL_TICKET_TYPE,
      }));
    } else {
      setAddingOverride((prevAddingOverride) => ({
        ...prevAddingOverride, ticket_type: newTicketType,
      }));
    }
  };

  const addingOverrideValueDidChange = (event) => {
    const newValue = parseIntOrNull(event.target.value);
    setAddingOverride((prevAddingOverride) => ({
      ...prevAddingOverride,
      override_value: newValue,
    }));
  };

  const addOverride = async () => {
    clearAllErrors();
    await createOverrideAsync({
      eventId,
      ticketTypeId: addingOverride.ticket_type.id,
      overrideValue: addingOverride.override_value,
    });

    setAddingOverride({
      ticket_type: NULL_TICKET_TYPE,
      override_value: null,
    });
  };

  const existingOverrideValueDidChange = (id, overrideValue) => {
    clearAllErrors();
    updateOverrideAsync({
      id, overrideValue: Number.parseInt(overrideValue, 10),
    });
  };

  const deleteOverrideConfirmed = async (override) => {
    clearAllErrors();
    await deleteOverrideAsync(override.id);
  };

  const rows = sortedOverrides.map((override) => (
    <tr key={override.id}>
      <td>{override.ticket_type.description}</td>
      <td>{override.ticket_type.maximum_event_provided_tickets}</td>
      <td>
        <InPlaceEditor
          value={override.override_value.toString(10)}
          onChange={(newValue) => { existingOverrideValueDidChange(override.id, newValue); }}
        />
      </td>
      <td>
        <button
          className="btn btn-sm btn-secondary"
          type="button"
          onClick={() => confirm({
            action: () => deleteOverrideConfirmed(override),
            prompt: t(
              'events.ticketQuotaOverrides.deletePrompt',
              'Are you sure you want to remove the override for "{{ ticketType }}" tickets?',
              { ticketType: override.ticket_type.description },
            ),
            renderError: (err) => <ErrorDisplay graphQLError={err} />,
          })}
        >
          <i className="fa fa-trash-o" />
          <span className="sr-only">
            {t(
              'events.ticketQuotaOverrides.deleteButton',
              'Delete override for {{ ticketType }}',
              { ticketType: override.ticket_type.description },
            )}
          </span>
        </button>
      </td>
    </tr>
  ));

  const ticketTypeOptions = unoverriddenTicketTypes.map((ticketType) => (
    <option value={ticketType.id} key={ticketType.id}>{ticketType.description}</option>
  ));

  const error = createError || updateError || deleteError;

  return (
    <div className="card bg-light">
      <div className="card-header">
        {t(
          'events.ticketQuotaOverrides.header',
          'Override event-provided {{ ticketName }} quotas',
          { ticketName },
        )}
      </div>
      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                {t(
                  'events.ticketQuotaOverrides.ticketTypeHeader',
                  '{{ ticketName }} type',
                  { ticketName: capitalize(ticketName) },
                )}
              </th>
              <th>{t('events.ticketQuotaOverrides.defaultQuotaHeader', 'Default quota')}</th>
              <th>{t('events.ticketQuotaOverrides.overridenQuotaHeader', 'Overridden quota')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <select
                  className="form-control"
                  value={addingOverride.ticket_type.id}
                  onChange={addingTicketTypeIdDidChange}
                >
                  <option aria-label={t('general.placeholderOptionLabel', 'Blank placeholder option')} />
                  {ticketTypeOptions}
                </select>
              </td>
              <td>{addingOverride.ticket_type.maximum_event_provided_tickets}</td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  value={
                    addingOverride.override_value == null ? '' : addingOverride.override_value
                  }
                  onChange={addingOverrideValueDidChange}
                  aria-label={t('events.ticketQuotaOverrides.overridenQuotaHeader', 'Overridden quota')}
                />
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  disabled={!addingOverrideDataComplete}
                  onClick={addOverride}
                >
                  {t('buttons.add', 'Add')}
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
        <ErrorDisplay graphQLError={error} />
      </div>
    </div>
  );
}

MaximumEventProvidedTicketsOverrideEditor.propTypes = {
  eventId: PropTypes.number.isRequired,
  ticketName: PropTypes.string.isRequired,
  overrides: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    ticket_type: TicketTypePropType.isRequired,
    override_value: PropTypes.number.isRequired,
  })).isRequired,
  ticketTypes: PropTypes.arrayOf(TicketTypePropType).isRequired,
  createOverride: PropTypes.func.isRequired,
  deleteOverride: PropTypes.func.isRequired,
  updateOverride: PropTypes.func.isRequired,
};

export default MaximumEventProvidedTicketsOverrideEditor;
