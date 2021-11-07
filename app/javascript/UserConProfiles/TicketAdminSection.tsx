import { useContext } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-restricted-imports
import { useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { useModal, useConfirm, ErrorDisplay, LoadingIndicator } from '@neinteractiveliterature/litform';

import ConvertToEventProvidedTicketModal from './ConvertToEventProvidedTicketModal';
import formatMoney from '../formatMoney';
import AddOrderToTicketButton, { AddOrderToTicketButtonProps } from './AddOrderToTicketButton';
import AppRootContext from '../AppRootContext';
import { Event } from '../graphqlTypes.generated';
import { useDeleteTicketMutation } from './mutations.generated';
import {
  UserConProfileAdminQueryData,
  TicketAdminWithTicketAbilityQueryData,
  TicketAdminWithoutTicketAbilityQueryData,
  TicketAdminWithTicketAbilityQueryDocument,
  TicketAdminWithoutTicketAbilityQueryDocument,
  UserConProfileAdminQueryDocument,
} from './queries.generated';
import { useAppDateTimeFormat } from '../TimeUtils';
import humanize from '../humanize';

type UserConProfileData = UserConProfileAdminQueryData['convention']['user_con_profile'];
type TicketData = NonNullable<UserConProfileData['ticket']>;
type OrderEntryData = NonNullable<TicketData['order_entry']>;

type TicketAdminControlsProps = {
  convention: {
    name: string;
    ticket_name: string;
    ticket_types: AddOrderToTicketButtonProps['convention']['ticket_types'];
  };
  userConProfile: Pick<UserConProfileData, 'id' | 'name' | 'name_without_nickname'> & {
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

  const { data, loading, error } = useQuery<
    TicketAdminWithTicketAbilityQueryData | TicketAdminWithoutTicketAbilityQueryData
  >(query, {
    variables: { ticketId: (userConProfile.ticket || {}).id },
  });
  const [deleteTicketMutate] = useDeleteTicketMutation();
  const confirm = useConfirm();
  const convertModal = useModal();

  const deleteTicket = async (refund: boolean) => {
    if (!userConProfile.ticket) {
      throw new Error(`User profile has no ${convention.ticket_name} to delete`);
    }
    await deleteTicketMutate({
      variables: {
        ticketId: userConProfile.ticket.id,
        refund,
      },
      update: (cache) => {
        const variables = { id: userConProfile.id };
        const cacheData = cache.readQuery<UserConProfileAdminQueryData>({
          query: UserConProfileAdminQueryDocument,
          variables,
        });
        if (!cacheData) {
          return;
        }
        cache.writeQuery<UserConProfileAdminQueryData>({
          query: UserConProfileAdminQueryDocument,
          variables,
          data: {
            ...cacheData,
            convention: {
              ...cacheData.convention,
              user_con_profile: {
                ...cacheData.convention.user_con_profile,
                ticket: null,
              },
            },
          },
        });
      },
    });
  };

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const buttons: JSX.Element[] = [];
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
          // eslint-disable-next-line react/no-array-index-key
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

function TicketAdminSection({ convention, userConProfile }: TicketAdminSectionProps): JSX.Element {
  const { timezoneName } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();

  const renderTicketData = (ticket: typeof userConProfile['ticket']) => {
    if (!ticket) {
      return <p>No {convention.ticket_name}</p>;
    }

    return (
      <dl className="row">
        <dt className="col-md-3">Type</dt>
        <dd className="col-md-9">{ticket.ticket_type.description}</dd>

        {ticket.provided_by_event && (
          <>
            <dt className="col-md-3">Provided by event</dt>
            <dd className="col-md-9">{ticket.provided_by_event.title}</dd>
          </>
        )}

        <dt className="col-md-3">Paid</dt>
        <dd className="col-md-9">{formatMoney(ticket.order_entry?.price_per_item) || '0'}</dd>

        <dt className="col-md-3">Transaction ID</dt>
        <dd className="col-md-9">{ticket.order_entry?.order?.charge_id}</dd>

        <dt className="col-md-3">Payment note</dt>
        <dd className="col-md-9">{ticket.order_entry?.order?.payment_note}</dd>

        <dt className="col-md-3">Created</dt>
        <dd className="col-md-9">
          {format(DateTime.fromISO(ticket.created_at, { zone: timezoneName }), 'longWeekdayDateTimeWithZone')}
        </dd>

        <dt className="col-md-3">Last updated</dt>
        <dd className="col-md-9">
          {format(DateTime.fromISO(ticket.updated_at, { zone: timezoneName }), 'longWeekdayDateTimeWithZone')}
        </dd>
      </dl>
    );
  };

  return (
    <section className="card">
      <div className="card-header">{humanize(convention.ticket_name)}</div>
      <div className="card-body pb-0">
        {renderTicketData(userConProfile.ticket)}
        <TicketAdminControls convention={convention} userConProfile={userConProfile} />
      </div>
    </section>
  );
}

export default TicketAdminSection;
