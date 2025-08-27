import { useContext } from 'react';
import { Link } from 'react-router';
import { useSuspenseQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { useModal, useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import ConvertToEventProvidedTicketModal from './ConvertToEventProvidedTicketModal';
import formatMoney from '../formatMoney';
import AddOrderToTicketButton, { AddOrderToTicketButtonProps } from './AddOrderToTicketButton';
import AppRootContext from '../AppRootContext';
import { Event, Ticket } from '../graphqlTypes.generated';
import {
  UserConProfileAdminQueryData,
  TicketAdminWithTicketAbilityQueryData,
  TicketAdminWithoutTicketAbilityQueryData,
  TicketAdminWithTicketAbilityQueryDocument,
  TicketAdminWithoutTicketAbilityQueryDocument,
} from './queries.generated';
import { useAppDateTimeFormat } from '../TimeUtils';
import { useTranslation } from 'react-i18next';
import { client } from 'useIntercodeApolloClient';
import { DeleteTicketDocument } from './mutations.generated';

type UserConProfileData = UserConProfileAdminQueryData['convention']['user_con_profile'];
type TicketData = NonNullable<UserConProfileData['ticket']>;
type OrderEntryData = NonNullable<TicketData['order_entry']>;

type TicketAdminControlsProps = {
  convention: {
    name: string;
    ticket_name: string;
    ticket_types: AddOrderToTicketButtonProps['convention']['ticket_types'];
  };
  userConProfile: Pick<UserConProfileData, 'id' | '__typename' | 'name' | 'name_without_nickname'> & {
    ticket?:
      | null
      | (Pick<TicketData, 'id' | 'created_at' | 'updated_at'> & {
          provided_by_event?: null | Pick<Event, 'title'>;
          ticket_type: Pick<TicketData['ticket_type'], 'id' | 'name' | 'description'>;
          order_entry?:
            | null
            | (Pick<OrderEntryData, 'price_per_item'> & {
                order?: null | Pick<OrderEntryData['order'], 'charge_id' | 'payment_note'>;
              });
        });
  };
};

function TicketAdminControls({ convention, userConProfile }: TicketAdminControlsProps) {
  const query = userConProfile.ticket
    ? TicketAdminWithTicketAbilityQueryDocument
    : TicketAdminWithoutTicketAbilityQueryDocument;

  const { data } = useSuspenseQuery<TicketAdminWithTicketAbilityQueryData | TicketAdminWithoutTicketAbilityQueryData>(
    query,
    {
      variables: { ticketId: (userConProfile.ticket || {}).id },
    },
  );
  const confirm = useConfirm();
  const convertModal = useModal();

  const deleteTicket = async (refund: boolean) => {
    if (!userConProfile.ticket) {
      throw new Error(`User profile has no ${convention.ticket_name} to delete`);
    }
    const ticketId = userConProfile.ticket.id;
    await client.mutate({
      mutation: DeleteTicketDocument,
      variables: { ticketId, refund },
      update: (cache) => {
        cache.modify<Ticket>({
          id: cache.identify({ __typename: 'Ticket', id: ticketId }),
          fields: (value, { DELETE }) => DELETE,
        });
      },
    });
  };

  const buttons: React.JSX.Element[] = [];
  const currentAbility = data?.currentAbility;
  const { ticket } = userConProfile;
  const chargeId = ticket?.order_entry?.order?.charge_id;

  if (ticket && !ticket.order_entry) {
    buttons.push(
      <AddOrderToTicketButton
        convention={convention}
        ticket={ticket}
        userConProfile={userConProfile}
        className="btn btn-success"
      />,
    );
  }

  if (ticket && (currentAbility as TicketAdminWithTicketAbilityQueryData['currentAbility']).can_update_ticket) {
    buttons.push(
      <Link to={`/user_con_profiles/${userConProfile.id}/admin_ticket/edit`} className="btn btn-secondary">
        Edit {convention.ticket_name}
      </Link>,
    );

    if ((currentAbility as TicketAdminWithTicketAbilityQueryData['currentAbility']).can_delete_ticket) {
      if (!ticket.provided_by_event) {
        buttons.push(
          <>
            <button className="btn btn-warning" type="button" onClick={convertModal.open}>
              {'Convert to event-provided '}
              {convention.ticket_name}
            </button>
            <ConvertToEventProvidedTicketModal
              visible={convertModal.visible}
              onClose={convertModal.close}
              convention={convention}
              userConProfile={userConProfile}
            />
          </>,
        );
      }

      if (chargeId) {
        buttons.push(
          <button
            className="btn btn-warning me-2"
            type="button"
            onClick={() =>
              confirm({
                action: () => deleteTicket(true),
                prompt: (
                  <>
                    <p>
                      Are you sure you want to delete {userConProfile.name}
                      ’s {convention.ticket_name} and refund their money?
                    </p>
                  </>
                ),
                renderError: (err) => <ErrorDisplay graphQLError={err} />,
              })
            }
          >
            Delete with refund
          </button>,
        );
      }

      buttons.push(
        <button
          className="btn btn-danger"
          type="button"
          onClick={() =>
            confirm({
              action: () => deleteTicket(false),
              prompt: (
                <>
                  <p>
                    Are you sure you want to delete {userConProfile.name}
                    ’s {convention.ticket_name} without a refund?
                  </p>
                </>
              ),
              renderError: (err) => <ErrorDisplay graphQLError={err} />,
            })
          }
        >
          Delete without refund
        </button>,
      );
    }
  } else if (currentAbility?.can_create_tickets) {
    buttons.push(
      <Link to={`/user_con_profiles/${userConProfile.id}/admin_ticket/new`} className="btn btn-secondary">
        Create {convention.ticket_name}
      </Link>,
    );
  }

  if (buttons.length > 0) {
    return (
      <ul className="list-inline">
        {buttons.map((button, i) => (
          <li key={i} className="list-inline-item">
            {button}
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

export type TicketAdminSectionProps = {
  convention: TicketAdminControlsProps['convention'];
  userConProfile: TicketAdminControlsProps['userConProfile'];
};

function TicketAdminSection({ convention, userConProfile }: TicketAdminSectionProps): React.JSX.Element {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();

  const renderTicketData = (ticket: (typeof userConProfile)['ticket']) => {
    if (!ticket) {
      return <p>{t('admin.userConProfiles.ticketAdminSection.noTicket', { ticketName: convention.ticket_name })}</p>;
    }

    return (
      <dl className="row">
        <dt className="col-md-3">{t('admin.userConProfiles.ticketAdminSection.ticketType')}</dt>
        <dd className="col-md-9">{ticket.ticket_type.description}</dd>

        {ticket.provided_by_event && (
          <>
            <dt className="col-md-3">{t('admin.userConProfiles.ticketAdminSection.providedByEvent')}</dt>
            <dd className="col-md-9">{ticket.provided_by_event.title}</dd>
          </>
        )}

        <dt className="col-md-3">{t('admin.userConProfiles.ticketAdminSection.paidAmount')}</dt>
        <dd className="col-md-9">{formatMoney(ticket.order_entry?.price_per_item) || '0'}</dd>

        <dt className="col-md-3">{t('admin.userConProfiles.ticketAdminSection.transactionID')}</dt>
        <dd className="col-md-9">{ticket.order_entry?.order?.charge_id}</dd>

        <dt className="col-md-3">{t('admin.userConProfiles.ticketAdminSection.paymentNote')}</dt>
        <dd className="col-md-9">{ticket.order_entry?.order?.payment_note}</dd>

        <dt className="col-md-3">{t('admin.userConProfiles.ticketAdminSection.createdAt')}</dt>
        <dd className="col-md-9">
          {format(DateTime.fromISO(ticket.created_at, { zone: timezoneName }), 'longWeekdayDateTimeWithZone')}
        </dd>

        <dt className="col-md-3">{t('admin.userConProfiles.ticketAdminSection.updatedAt')}</dt>
        <dd className="col-md-9">
          {format(DateTime.fromISO(ticket.updated_at, { zone: timezoneName }), 'longWeekdayDateTimeWithZone')}
        </dd>
      </dl>
    );
  };

  return (
    <section className="card">
      <div className="card-header">
        {t('admin.userConProfiles.ticketAdminSection.title', { ticketName: convention.ticket_name })}
      </div>
      <div className="card-body pb-0">
        {renderTicketData(userConProfile.ticket)}
        <TicketAdminControls convention={convention} userConProfile={userConProfile} />
      </div>
    </section>
  );
}

export default TicketAdminSection;
