import { useState, useMemo, useCallback, SyntheticEvent } from 'react';
import { ApolloError } from '@apollo/client';
import { useModal, BootstrapFormSelect, ErrorDisplay, FormGroupWithLabel } from '@neinteractiveliterature/litform';

import EventSelect from '../BuiltInFormControls/EventSelect';
import sortTicketTypes from '../TicketTypeAdmin/sortTicketTypes';
import useAsyncFunction from '../useAsyncFunction';
import formatMoney from '../formatMoney';
import EditOrderModal from '../Store/EditOrderModal';
import AddOrderToTicketButton, { AddOrderToTicketButtonProps } from './AddOrderToTicketButton';
import { UserConProfileAdminQueryData } from './queries.generated';
import { TicketInput, UserConProfile } from '../graphqlTypes.generated';
import { useTranslation } from 'react-i18next';

type TicketFromQuery = NonNullable<UserConProfileAdminQueryData['convention']['user_con_profile']['ticket']>;
type EditingTicket = Omit<TicketFromQuery, 'id' | 'ticket_type' | 'created_at' | 'updated_at' | '__typename'> &
  Partial<Pick<TicketFromQuery, 'ticket_type' | 'id'>>;

export type TicketFormProps = {
  initialTicket: EditingTicket;
  convention: UserConProfileAdminQueryData['convention'];
  onSubmit: (ticketInput: TicketInput) => Promise<void>;
  submitCaption: string;
  userConProfile: Pick<UserConProfile, 'id' | '__typename' | 'name_without_nickname'>;
};

function TicketForm({
  userConProfile,
  initialTicket,
  convention,
  onSubmit,
  submitCaption,
}: TicketFormProps): JSX.Element {
  const { t } = useTranslation();
  const editOrderModal = useModal();
  const [ticketTypeId, setTicketTypeId] = useState(initialTicket.ticket_type?.id);
  const [providedByEvent, setProvidedByEvent] = useState(initialTicket.provided_by_event);

  const sortedTicketTypes = useMemo(() => sortTicketTypes(convention.ticket_types), [convention.ticket_types]);

  const [submit, submitError, submitInProgress] = useAsyncFunction(onSubmit);

  const submitForm = useCallback(
    async (event: SyntheticEvent) => {
      if (!ticketTypeId) {
        return;
      }
      const ticketInput = {
        ticketTypeId: ticketTypeId,
        providedByEventId: providedByEvent?.id,
      };
      event.preventDefault();
      await submit(ticketInput);
    },
    [submit, providedByEvent?.id, ticketTypeId],
  );

  const orderEntry = initialTicket.order_entry;
  const order = orderEntry?.order;

  return (
    <form onSubmit={submitForm}>
      <BootstrapFormSelect
        label={t('admin.userConProfiles.ticketForm.ticketTypeLabel', { ticketName: convention.ticket_name })}
        value={ticketTypeId ?? ''}
        onValueChange={(newValue) => setTicketTypeId(newValue)}
      >
        <option aria-label={t('general.placeholderOptionLabel')} />
        {sortedTicketTypes.map(({ id, description }) => (
          <option value={id} key={id}>
            {description}
          </option>
        ))}
      </BootstrapFormSelect>

      <FormGroupWithLabel label={t('admin.userConProfiles.ticketForm.providedByEvent')}>
        {(id) => <EventSelect inputId={id} value={providedByEvent} onChange={setProvidedByEvent} />}
      </FormGroupWithLabel>

      <div className="card mb-4">
        <div className="card-header">{t('admin.userConProfiles.ticketForm.orderInformationHeader')}</div>

        <div className="card-body">
          {orderEntry ? (
            <>
              <dl className="row">
                <dt className="col-md-3">{t('admin.userConProfiles.ticketForm.orderID')}</dt>
                <dd className="col-md-9">{orderEntry.order.id}</dd>

                <dt className="col-md-3">
                  {t('admin.userConProfiles.ticketForm.ticketPrice', { ticketName: convention.ticket_name })}
                </dt>
                <dd className="col-md-9">{formatMoney(orderEntry.price_per_item)}</dd>
              </dl>

              <button
                className="btn btn-outline-primary"
                onClick={() => editOrderModal.open({ order: orderEntry.order })}
                type="button"
              >
                {t('admin.userConProfiles.ticketForm.editOrderButton')}
              </button>
            </>
          ) : (
            initialTicket.id &&
            initialTicket.ticket_type?.id && (
              <AddOrderToTicketButton
                ticket={initialTicket as AddOrderToTicketButtonProps['ticket']}
                userConProfile={userConProfile}
                convention={convention}
                className="btn btn-outline-success"
              />
            )
          )}
        </div>
      </div>

      <EditOrderModal order={editOrderModal.visible ? order : undefined} closeModal={editOrderModal.close} />

      <ErrorDisplay graphQLError={submitError as ApolloError} />

      <input
        type="submit"
        aria-label={submitCaption}
        value={submitCaption}
        className="btn btn-primary"
        disabled={submitInProgress}
      />
    </form>
  );
}

export default TicketForm;
