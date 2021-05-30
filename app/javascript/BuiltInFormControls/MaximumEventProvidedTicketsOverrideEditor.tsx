import { useState, useMemo } from 'react';
import * as React from 'react';
// @ts-ignore
import { capitalize } from 'inflected';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';

import ErrorDisplay from '../ErrorDisplay';
import InPlaceEditor from './InPlaceEditor';
import useAsyncFunction from '../useAsyncFunction';
import { sortByLocaleString, parseIntOrNull } from '../ValueUtils';
import { useConfirm } from '../ModalDialogs/Confirm';
import { TicketType, MaximumEventProvidedTicketsOverride } from '../graphqlTypes.generated';

type TicketTypeForMEPTO = Pick<TicketType, 'id' | 'description' | 'maximum_event_provided_tickets'>;

const NULL_TICKET_TYPE: TicketTypeForMEPTO = {
  id: 0,
  description: '',
  maximum_event_provided_tickets: 0,
};

type MEPTOForEditor = Pick<MaximumEventProvidedTicketsOverride, 'id' | 'override_value'> & {
  ticket_type: TicketTypeForMEPTO;
};

export type MEPTOInput = {
  eventId: number;
  overrideValue: number;
  ticketTypeId: number;
};

export type MEPTOEditorProps = {
  eventId: number;
  ticketName: string;
  overrides: MEPTOForEditor[];
  ticketTypes: TicketTypeForMEPTO[];
  createOverride: (input: MEPTOInput) => Promise<any>;
  updateOverride: (input: { id: number; overrideValue: number }) => Promise<any>;
  deleteOverride: (id: number) => Promise<any>;
};

function MaximumEventProvidedTicketsOverrideEditor({
  eventId,
  ticketName,
  overrides,
  ticketTypes,
  createOverride,
  updateOverride,
  deleteOverride,
}: MEPTOEditorProps) {
  const { t } = useTranslation();
  const [createOverrideAsync, createError, , clearCreateError] = useAsyncFunction(createOverride);
  const [updateOverrideAsync, updateError, , clearUpdateError] = useAsyncFunction(updateOverride);
  const [deleteOverrideAsync, deleteError, , clearDeleteError] = useAsyncFunction(deleteOverride);
  const [addingOverride, setAddingOverride] = useState<{
    ticket_type: TicketTypeForMEPTO;
    override_value: number | null;
  }>({
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
    () => sortByLocaleString(overrides, (o) => o.ticket_type?.description ?? ''),
    [overrides],
  );

  const sortedTicketTypes = useMemo(
    () => sortByLocaleString(ticketTypes, (tt) => tt.description ?? ''),
    [ticketTypes],
  );

  const unoverriddenTicketTypes = useMemo(
    () =>
      sortedTicketTypes.filter((ticketType) =>
        overrides.every((override) => override.ticket_type.id !== ticketType.id),
      ),
    [overrides, sortedTicketTypes],
  );

  const addingOverrideDataComplete =
    !!addingOverride.ticket_type.id && addingOverride.override_value != null;

  const addingTicketTypeIdDidChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTicketType = ticketTypes.find(
      (ticketType) => ticketType.id.toString() === event.target.value,
    );

    if (newTicketType == null) {
      setAddingOverride((prevAddingOverride) => ({
        ...prevAddingOverride,
        ticket_type: NULL_TICKET_TYPE,
      }));
    } else {
      setAddingOverride((prevAddingOverride) => ({
        ...prevAddingOverride,
        ticket_type: newTicketType,
      }));
    }
  };

  const addingOverrideValueDidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      overrideValue: addingOverride.override_value!,
    });

    setAddingOverride({
      ticket_type: NULL_TICKET_TYPE,
      override_value: null,
    });
  };

  const existingOverrideValueDidChange = (id: number, overrideValue: string) => {
    clearAllErrors();
    updateOverrideAsync({
      id,
      overrideValue: Number.parseInt(overrideValue, 10),
    });
  };

  const deleteOverrideConfirmed = async (override: { id: number }) => {
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
          onChange={(newValue) => {
            existingOverrideValueDidChange(override.id, newValue);
          }}
        />
      </td>
      <td>
        <button
          className="btn btn-sm btn-secondary"
          type="button"
          onClick={() =>
            confirm({
              action: () => deleteOverrideConfirmed(override),
              prompt: t(
                'events.ticketQuotaOverrides.deletePrompt',
                'Are you sure you want to remove the override for "{{ ticketType }}" tickets?',
                { ticketType: override.ticket_type.description },
              ),
              renderError: (err) => <ErrorDisplay graphQLError={err} />,
            })
          }
        >
          <i className="fa fa-trash-o" />
          <span className="visually-hidden">
            {t('events.ticketQuotaOverrides.deleteButton', 'Delete override for {{ ticketType }}', {
              ticketType: override.ticket_type.description,
            })}
          </span>
        </button>
      </td>
    </tr>
  ));

  const ticketTypeOptions = unoverriddenTicketTypes.map((ticketType) => (
    <option value={ticketType.id} key={ticketType.id}>
      {ticketType.description}
    </option>
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
                {t('events.ticketQuotaOverrides.ticketTypeHeader', '{{ ticketName }} type', {
                  ticketName: capitalize(ticketName),
                })}
              </th>
              <th>{t('events.ticketQuotaOverrides.defaultQuotaHeader', 'Default quota')}</th>
              <th>{t('events.ticketQuotaOverrides.overridenQuotaHeader', 'Overridden quota')}</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
          <tfoot>
            <tr>
              <td>
                <select
                  className="form-control"
                  value={addingOverride.ticket_type.id}
                  onChange={addingTicketTypeIdDidChange}
                >
                  <option
                    aria-label={t('general.placeholderOptionLabel', 'Blank placeholder option')}
                  />
                  {ticketTypeOptions}
                </select>
              </td>
              <td>{addingOverride.ticket_type.maximum_event_provided_tickets}</td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  value={addingOverride.override_value == null ? '' : addingOverride.override_value}
                  onChange={addingOverrideValueDidChange}
                  aria-label={t(
                    'events.ticketQuotaOverrides.overridenQuotaHeader',
                    'Overridden quota',
                  )}
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
        <ErrorDisplay graphQLError={error as ApolloError | null} />
      </div>
    </div>
  );
}

export default MaximumEventProvidedTicketsOverrideEditor;
