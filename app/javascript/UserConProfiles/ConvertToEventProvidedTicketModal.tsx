import { useState } from 'react';
import * as React from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError } from '@apollo/client';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import EventSelect, { DefaultEventSelectOptionType } from '../BuiltInFormControls/EventSelect';
import ProvidableTicketTypeSelection from '../EventsApp/TeamMemberAdmin/ProvidableTicketTypeSelection';
import TicketingStatusDescription, {
  TicketingStatusDescriptionProps,
} from '../EventsApp/TeamMemberAdmin/TicketingStatusDescription';
import useAsyncFunction from '../useAsyncFunction';
import {
  useConvertToEventProvidedTicketQuery,
  UserConProfileAdminQueryData,
  UserConProfileAdminQueryDocument,
} from './queries.generated';
import { useConvertTicketToEventProvidedMutation } from './mutations.generated';
import { DefaultEventsQueryData } from '../BuiltInFormControls/selectDefaultQueries.generated';
import { Convention } from '../graphqlTypes.generated';

type EventSpecificSectionProps = {
  event: {
    id: string;
  };
  userConProfile: TicketingStatusDescriptionProps['userConProfile'];
  convention: Pick<Convention, 'name' | 'ticket_name'>;
  ticketTypeId?: string;
  setTicketTypeId: React.Dispatch<string>;
  disabled?: boolean;
};

function EventSpecificSection({
  event,
  userConProfile,
  convention,
  ticketTypeId,
  setTicketTypeId,
  disabled,
}: EventSpecificSectionProps) {
  const { data, loading, error } = useConvertToEventProvidedTicketQuery({
    variables: { eventId: event.id },
  });

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data) {
    return <ErrorDisplay stringError="No data loaded for query" />;
  }

  return (
    <>
      <p className="mt-4">
        <TicketingStatusDescription userConProfile={userConProfile} convention={convention} />
      </p>

      <ProvidableTicketTypeSelection
        convention={data.convention}
        value={ticketTypeId}
        onChange={setTicketTypeId}
        disabled={disabled}
      />
    </>
  );
}

export type ConvertToEventProvidedTicketModalProps = {
  convention: Pick<Convention, 'name' | 'ticket_name'>;
  userConProfile: TicketingStatusDescriptionProps['userConProfile'] & { id: string };
  visible: boolean;
  onClose: () => void;
};
type EventType = NonNullable<DefaultEventsQueryData['convention']>['events_paginated']['entries'][0];

function ConvertToEventProvidedTicketModal({
  convention,
  userConProfile,
  visible,
  onClose,
}: ConvertToEventProvidedTicketModalProps): JSX.Element {
  const [event, setEvent] = useState<EventType>();
  const [ticketTypeId, setTicketTypeId] = useState<string>();
  const [convertMutate] = useConvertTicketToEventProvidedMutation();
  const [convertTicketToEventProvided, error, inProgress] = useAsyncFunction(convertMutate);

  const convertClicked = async () => {
    if (event == null || ticketTypeId == null) {
      return;
    }

    await convertTicketToEventProvided({
      variables: {
        eventId: event.id,
        ticketTypeId,
        userConProfileId: userConProfile.id,
      },
      update: (cache, result) => {
        const cachedData = cache.readQuery<UserConProfileAdminQueryData>({
          query: UserConProfileAdminQueryDocument,
          variables: { id: userConProfile.id },
        });
        if (!cachedData) {
          return;
        }

        cache.writeQuery<UserConProfileAdminQueryData>({
          query: UserConProfileAdminQueryDocument,
          variables: { id: userConProfile.id },
          data: {
            ...cachedData,
            convention: {
              ...cachedData.convention,
              user_con_profile: {
                ...cachedData.convention.user_con_profile,
                ticket: result.data?.convertTicketToEventProvided?.ticket,
              },
            },
          },
        });
      },
    });
    onClose();
  };

  return (
    <Modal visible={visible}>
      <div className="modal-header">
        {'Convert '}
        {userConProfile.name_without_nickname}
        {"'s "}
        {convention.ticket_name}
        {' to event-provided'}
      </div>

      <div className="modal-body">
        <p>
          {'This will delete '}
          {userConProfile.name_without_nickname}
          ’s
          {' existing '}
          {convention.ticket_name}
          {' and create a new one for them, provided by an event.  If they paid for their existing '}
          {convention.ticket_name}, that payment will be refunded.
        </p>

        <EventSelect
          value={event}
          onChange={(value: DefaultEventSelectOptionType) => {
            setEvent(value);
            setTicketTypeId(undefined);
          }}
          placeholder="Select event..."
          isDisabled={inProgress}
        />

        {event && (
          <EventSpecificSection
            event={event}
            userConProfile={userConProfile}
            convention={convention}
            ticketTypeId={ticketTypeId}
            setTicketTypeId={setTicketTypeId}
            disabled={inProgress}
          />
        )}

        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>

      <div className="modal-footer">
        <button type="button" onClick={onClose} className="btn btn-secondary" disabled={inProgress}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={inProgress || !event || !ticketTypeId}
          onClick={convertClicked}
        >
          {'Convert '}
          {convention.ticket_name}
        </button>
      </div>
    </Modal>
  );
}

export default ConvertToEventProvidedTicketModal;
