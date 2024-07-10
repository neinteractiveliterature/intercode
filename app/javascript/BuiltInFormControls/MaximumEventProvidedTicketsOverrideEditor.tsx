import { useState, useMemo } from 'react';
import * as React from 'react';
import capitalize from 'lodash/capitalize';
import { useTranslation } from 'react-i18next';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay, sortByLocaleString, parseIntOrNull, useConfirm } from '@neinteractiveliterature/litform';

import InPlaceEditor from './InPlaceEditor';
import useAsyncFunction from '../useAsyncFunction';
import { TicketType, MaximumEventProvidedTicketsOverride } from '../graphqlTypes.generated';

type TicketTypeForMEPTO = Pick<TicketType, 'description' | 'maximum_event_provided_tickets'> & { id: string };

const NULL_TICKET_TYPE: TicketTypeForMEPTO = {
  id: '',
  description: '',
  maximum_event_provided_tickets: 0,
};

type MEPTOForEditor = Pick<MaximumEventProvidedTicketsOverride, 'override_value'> & {
  id: string;
  ticket_type: TicketTypeForMEPTO;
};

export type MEPTOInput = {
  eventId: string;
  overrideValue: number;
  ticketTypeId: string;
};

export type MEPTOEditorProps = {
  eventId: string;
  ticketName: string;
  overrides: MEPTOForEditor[];
  ticketTypes: TicketTypeForMEPTO[];
  createOverride: (input: MEPTOInput) => Promise<unknown>;
  updateOverride: (input: { id: string; overrideValue: number }) => Promise<unknown>;
  deleteOverride: (mepto: MEPTOForEditor) => Promise<unknown>;
};

function MaximumEventProvidedTicketsOverrideEditor({
  eventId,
  ticketName,
  overrides,
  ticketTypes,
  createOverride,
  updateOverride,
  deleteOverride,
}: MEPTOEditorProps): JSX.Element {
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

  const sortedTicketTypes = useMemo(() => sortByLocaleString(ticketTypes, (tt) => tt.description ?? ''), [ticketTypes]);

  const unoverriddenTicketTypes = useMemo(
    () =>
      sortedTicketTypes.filter((ticketType) =>
        overrides.every((override) => override.ticket_type.id !== ticketType.id),
      ),
    [overrides, sortedTicketTypes],
  );

  const addingOverrideDataComplete = !!addingOverride.ticket_type.id && addingOverride.override_value != null;

  const addingTicketTypeIdDidChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTicketType = ticketTypes.find((ticketType) => ticketType.id.toString() === event.target.value);

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
    if (addingOverride.override_value == null) {
      return;
    }

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

  const existingOverrideValueDidChange = (id: string, overrideValue: string) => {
    clearAllErrors();
    updateOverrideAsync({
      id,
      overrideValue: Number.parseInt(overrideValue, 10),
    });
  };

  const deleteOverrideConfirmed = async (override: MEPTOForEditor) => {
    clearAllErrors();
    await deleteOverrideAsync(override);
  };

  const rows = sortedOverrides.map((override) => (
    <tr key={override.id}>
      <td>{override.ticket_type.description}</td>
      <td>{override.ticket_type.maximum_event_provided_tickets}</td>
      <td>
        <InPlaceEditor
          value={override.override_value.toString(10)}
          onChange={(newValue: string) => {
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
              prompt: t('events.ticketQuotaOverrides.deletePrompt', { ticketType: override.ticket_type.description }),
              renderError: (err) => <ErrorDisplay graphQLError={err} />,
            })
          }
        >
          <i className="bi-trash" />
          <span className="visually-hidden">
            {t('events.ticketQuotaOverrides.deleteButton', {
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
      <div className="card-header">{t('events.ticketQuotaOverrides.header', { ticketName })}</div>
      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                {t('events.ticketQuotaOverrides.ticketTypeHeader', {
                  ticketName: capitalize(ticketName),
                })}
              </th>
              <th>{t('events.ticketQuotaOverrides.defaultQuotaHeader')}</th>
              <th>{t('events.ticketQuotaOverrides.overridenQuotaHeader')}</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
          <tfoot>
            <tr>
              <td>
                <select
                  className="form-select"
                  value={addingOverride.ticket_type.id}
                  onChange={addingTicketTypeIdDidChange}
                >
                  <option aria-label={t('general.placeholderOptionLabel')} />
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
                  aria-label={t('events.ticketQuotaOverrides.overridenQuotaHeader')}
                />
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  disabled={!addingOverrideDataComplete}
                  onClick={addOverride}
                >
                  {t('buttons.add')}
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
