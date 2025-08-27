import { useState } from 'react';
import * as React from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError, useMutation, useSuspenseQuery } from '@apollo/client';
import { ErrorDisplay, LoadingIndicator } from '@neinteractiveliterature/litform';

import EventSelect, { DefaultEventSelectOptionType } from '../BuiltInFormControls/EventSelect';
import ProvidableTicketTypeSelection from '../EventsApp/TeamMemberAdmin/ProvidableTicketTypeSelection';
import TicketingStatusDescription, {
  TicketingStatusDescriptionProps,
} from '../EventsApp/TeamMemberAdmin/TicketingStatusDescription';
import useAsyncFunction from '../useAsyncFunction';
import {
  ConvertToEventProvidedTicketQueryDocument,
  UserConProfileAdminQueryData,
  UserConProfileAdminQueryDocument,
} from './queries.generated';
import { DefaultEventsQueryData } from '../BuiltInFormControls/selectDefaultQueries.generated';
import { Convention } from '../graphqlTypes.generated';
import { useTranslation } from 'react-i18next';
import { ConvertTicketToEventProvidedDocument } from './mutations.generated';

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
  const { data } = useSuspenseQuery(ConvertToEventProvidedTicketQueryDocument, {
    variables: { eventId: event.id },
  });

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
}: ConvertToEventProvidedTicketModalProps): React.JSX.Element {
  const { t } = useTranslation();
  const [event, setEvent] = useState<EventType>();
  const [ticketTypeId, setTicketTypeId] = useState<string>();
  const [convertMutate] = useMutation(ConvertTicketToEventProvidedDocument);
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
        {t('admin.userConProfiles.convertToEventProvidedTicket.title', {
          name: userConProfile.name_without_nickname,
          ticketName: convention.ticket_name,
        })}
      </div>

      <div className="modal-body">
        <p>
          {t('admin.userConProfiles.convertToEventProvidedTicket.prompt', {
            name: userConProfile.name_without_nickname,
            ticketName: convention.ticket_name,
          })}
        </p>

        <EventSelect
          value={event}
          onChange={(value: DefaultEventSelectOptionType) => {
            setEvent(value);
            setTicketTypeId(undefined);
          }}
          isDisabled={inProgress}
        />

        {event && (
          <React.Suspense fallback={<LoadingIndicator />}>
            <EventSpecificSection
              event={event}
              userConProfile={userConProfile}
              convention={convention}
              ticketTypeId={ticketTypeId}
              setTicketTypeId={setTicketTypeId}
              disabled={inProgress}
            />
          </React.Suspense>
        )}

        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>

      <div className="modal-footer">
        <button type="button" onClick={onClose} className="btn btn-secondary" disabled={inProgress}>
          {t('buttons.cancel')}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={inProgress || !event || !ticketTypeId}
          onClick={convertClicked}
        >
          {t('admin.userConProfiles.convertToEventProvidedTicket.buttonText', { ticketName: convention.ticket_name })}
        </button>
      </div>
    </Modal>
  );
}

export default ConvertToEventProvidedTicketModal;
