import { useCallback, useMemo } from 'react';
import { LoaderFunction, useFetcher, useLoaderData, useNavigate } from 'react-router-dom';

import useEventForm, { EventForm } from '../../EventAdmin/useEventForm';
import EditEvent from '../../BuiltInForms/EditEvent';
import MaximumEventProvidedTicketsOverrideEditor from '../../BuiltInFormControls/MaximumEventProvidedTicketsOverrideEditor';
import usePageTitle from '../../usePageTitle';
import {
  StandaloneEditEventQueryData,
  StandaloneEditEventQueryVariables,
  StandaloneEditEventQueryDocument,
} from './queries.generated';
import deserializeFormResponse, { WithFormResponse } from '../../Models/deserializeFormResponse';
import { CommonFormFieldsFragment } from '../../Models/commonFormFragments.generated';
import FourOhFourPage from '../../FourOhFourPage';
import { AuthorizationError } from '../../Authentication/useAuthorizationRequired';
import buildEventUrl from '../buildEventUrl';
import { ImageAttachmentConfig } from '../../BuiltInFormControls/MarkdownInput';
import { client } from '../../useIntercodeApolloClient';
import { StandaloneUpdateEventDocument } from './mutations.generated';

export type StandaloneEditEventFormProps = {
  initialEvent: WithFormResponse<StandaloneEditEventQueryData['convention']['event']>;
  eventPath: string;
  eventForm: CommonFormFieldsFragment;
  convention: NonNullable<StandaloneEditEventQueryData['convention']>;
  currentAbility: StandaloneEditEventQueryData['currentAbility'];
};

function StandaloneEditEventForm({
  initialEvent,
  eventPath,
  eventForm,
  convention,
  currentAbility,
}: StandaloneEditEventFormProps) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const imageAttachmentConfig = useMemo<ImageAttachmentConfig>(
    () => ({
      addBlob: (blob) =>
        fetcher.submit({ signed_blob_id: blob.signed_id }, { action: '../attach_image', method: 'PATCH' }),
      existingImages: initialEvent.images,
    }),
    [fetcher, initialEvent.images],
  );

  const [eventFormProps, { event, validateForm }] = useEventForm({
    convention,
    initialEvent,
    eventForm,
    imageAttachmentConfig,
  });

  const updateEvent = useCallback(async () => {
    await client.mutate({
      mutation: StandaloneUpdateEventDocument,
      variables: {
        input: {
          event: { form_response_attrs_json: JSON.stringify(event.form_response_attrs) },
          id: event.id,
        },
      },
    });
  }, [event]);

  return (
    <EditEvent
      event={event}
      validateForm={validateForm}
      updateEvent={updateEvent}
      onSave={() => {
        navigate(eventPath);
      }}
    >
      <EventForm {...eventFormProps} />
      {currentAbility.can_override_maximum_event_provided_tickets && convention.ticket_mode !== 'disabled' && (
        <MaximumEventProvidedTicketsOverrideEditor
          ticketName={convention.ticket_name}
          ticketTypes={convention.ticket_types}
          // we use initialEvent here because we want it to be controlled by the query result
          overrides={initialEvent.maximum_event_provided_tickets_overrides}
          eventId={initialEvent.id}
        />
      )}
    </EditEvent>
  );
}

export const loader: LoaderFunction = async ({ params: { eventId } }) => {
  const { data } = await client.query<StandaloneEditEventQueryData, StandaloneEditEventQueryVariables>({
    query: StandaloneEditEventQueryDocument,
    variables: { eventId: eventId ?? '' },
  });
  return data;
};

function StandaloneEditEvent(): JSX.Element {
  const data = useLoaderData() as StandaloneEditEventQueryData;

  const initialEvent = useMemo(() => deserializeFormResponse(data.convention.event), [data]);

  usePageTitle(`Editing “${initialEvent?.title}”`);

  if (!data || !initialEvent) {
    return <FourOhFourPage />;
  }

  if (!data.currentAbility.can_update_event) {
    return <AuthorizationError />;
  }

  return (
    <StandaloneEditEventForm
      initialEvent={initialEvent}
      eventForm={data.convention.event.event_category.event_form}
      convention={data.convention}
      eventPath={buildEventUrl(data.convention.event)}
      currentAbility={data.currentAbility}
    />
  );
}

export const Component = StandaloneEditEvent;
