import React, { useContext } from 'react';
import { humanize } from 'inflected';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { useConfirm } from '../ModalDialogs/Confirm';
import ConvertToEventProvidedTicketModal from './ConvertToEventProvidedTicketModal';
import ErrorDisplay from '../ErrorDisplay';
import formatMoney from '../formatMoney';
import {
  TicketAdminWithTicketAbilityQuery,
  TicketAdminWithoutTicketAbilityQuery,
  UserConProfileAdminQuery,
} from './queries';
import LoadingIndicator from '../LoadingIndicator';
import useModal from '../ModalDialogs/useModal';
import AddOrderToTicketButton, { AddOrderToTicketButtonProps } from './AddOrderToTicketButton';
import AppRootContext from '../AppRootContext';
import { Money } from '../graphqlTypes.generated';
import { useDeleteTicketMutation } from './mutations.generated';
import {
  UserConProfileAdminQueryQuery,
  TicketAdminWithTicketAbilityQueryQuery,
  TicketAdminWithoutTicketAbilityQueryQuery,
} from './queries.generated';

type TicketAdminControlsProps = {
  convention: {
    ticket_name: string;
    ticket_types: AddOrderToTicketButtonProps['convention']['ticket_types'];
  };
  userConProfile: {
    id: number;
    name?: string | null;
    ticket?: {
      id: number;
      provided_by_event?: {
        title: string;
      };
      ticket_type: {
        id: number;
        description?: string;
      };
      order_entry?: {
        price_per_item?: Money;
        order?: {
          charge_id?: string;
          payment_note?: string;
        };
      };
      created_at: string;
      updated_at: string;
    };
  };
};

function TicketAdminControls({ convention, userConProfile }: TicketAdminControlsProps) {
  const query = userConProfile.ticket
    ? TicketAdminWithTicketAbilityQuery
    : TicketAdminWithoutTicketAbilityQuery;

  const { data, loading, error } = useQuery<
    TicketAdminWithTicketAbilityQueryQuery | TicketAdminWithoutTicketAbilityQueryQuery
  >(query, {
    variables: { ticketId: (userConProfile.ticket || {}).id },
  });
  const [deleteTicketMutate] = useDeleteTicketMutation();
  const confirm = useConfirm();
  const convertModal = useModal();

  const deleteTicket = (refund: boolean) =>
    deleteTicketMutate({
      variables: {
        ticketId: userConProfile.ticket!.id,
        refund,
      },
      update: (cache) => {
        const variables = { id: userConProfile.id };
        const cacheData = cache.readQuery<UserConProfileAdminQueryQuery>({
          query: UserConProfileAdminQuery,
          variables,
        });
        cache.writeQuery({
          query: UserConProfileAdminQuery,
          variables,
          data: {
            ...cacheData,
            userConProfile: {
              ...cacheData?.userConProfile,
              ticket: null,
            },
          },
        });
      },
    });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const buttons: JSX.Element[] = [];
  const { currentAbility } = data!;
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

  if (
    ticket &&
    (currentAbility as TicketAdminWithTicketAbilityQueryQuery['currentAbility']).can_update_ticket
  ) {
    buttons.push(
      <Link
        to={`/user_con_profiles/${userConProfile.id}/admin_ticket/edit`}
        className="btn btn-secondary"
      >
        Edit {convention.ticket_name}
      </Link>,
    );

    if (
      (currentAbility as TicketAdminWithTicketAbilityQueryQuery['currentAbility']).can_delete_ticket
    ) {
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
            className="btn btn-warning mr-2"
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
  } else if (currentAbility.can_create_tickets) {
    buttons.push(
      <Link
        to={`/user_con_profiles/${userConProfile.id}/admin_ticket/new`}
        className="btn btn-secondary"
      >
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

function TicketAdminSection({ convention, userConProfile }: TicketAdminSectionProps) {
  const { timezoneName } = useContext(AppRootContext);

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
          {moment.tz(ticket.created_at, timezoneName).format('MMMM D, YYYY h:mma z')}
        </dd>

        <dt className="col-md-3">Last updated</dt>
        <dd className="col-md-9">
          {moment.tz(ticket.updated_at, timezoneName).format('MMMM D, YYYY h:mma z')}
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
