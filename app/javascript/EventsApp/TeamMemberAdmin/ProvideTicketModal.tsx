import { useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useTranslation } from 'react-i18next';
import capitalize from 'lodash/capitalize';

import { getProvidableTicketTypes } from './ProvideTicketUtils';
import ProvidableTicketTypeSelection from './ProvidableTicketTypeSelection';
import TicketingStatusDescription from './TicketingStatusDescription';
import { ActionFunction, Form, redirect, useLoaderData, useNavigate, useNavigation, useParams } from 'react-router-dom';
import { singleTeamMemberLoader, SingleTeamMemberLoaderResult } from './loader';
import { client } from '../../useIntercodeApolloClient';
import { ProvideEventTicketDocument } from './mutations.generated';
import { TeamMembersQueryDocument } from './queries.generated';

export const loader = singleTeamMemberLoader;

export const action: ActionFunction = async ({ params: { eventId }, request }) => {
  const formData = await request.formData();
  await client.mutate({
    mutation: ProvideEventTicketDocument,
    variables: {
      eventId,
      userConProfileId: formData.get('userConProfileId'),
      ticketTypeId: formData.get('ticketTypeId'),
    },
    refetchQueries: [{ query: TeamMembersQueryDocument, variables: { eventId: eventId } }],
    awaitRefetchQueries: true,
  });
  return redirect(`/events/${eventId}/team_members`);
};

function ProvideTicketModal(): JSX.Element {
  const { data, teamMember } = useLoaderData() as SingleTeamMemberLoaderResult;
  const { t } = useTranslation();
  const [ticketTypeId, setTicketTypeId] = useState<string>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { eventId } = useParams();

  const { convention } = data;

  if (getProvidableTicketTypes(data.convention).length < 1) {
    return <></>;
  }

  const mutationInProgress = navigation.state === 'submitting';
  const onClose = () => {
    navigate(`/events/${eventId}/team_members`);
  };

  return (
    <Modal visible>
      <Form action="." method="POST">
        <div className="modal-header">{capitalize(convention.ticketNamePlural)}</div>
        <div className="modal-body">
          {teamMember ? (
            <>
              <input type="hidden" name="userConProfileId" value={teamMember.user_con_profile.id} />

              <p>
                <TicketingStatusDescription userConProfile={teamMember.user_con_profile} convention={convention} />
              </p>

              {teamMember && !teamMember.user_con_profile.ticket ? (
                <ProvidableTicketTypeSelection
                  convention={convention}
                  value={ticketTypeId}
                  onChange={setTicketTypeId}
                  disabled={mutationInProgress}
                />
              ) : null}
            </>
          ) : null}

          {/* <ErrorDisplay graphQLError={error as ApolloError} /> */}
        </div>
        <div className="modal-footer">
          {teamMember && teamMember.user_con_profile.ticket ? (
            <button type="button" className="btn btn-primary" onClick={onClose}>
              {t('buttons.ok')}
            </button>
          ) : (
            <>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={mutationInProgress}>
                {t('buttons.cancel')}
              </button>
              <button type="submit" className="btn btn-primary" disabled={ticketTypeId == null || mutationInProgress}>
                {t('events.teamMemberAdmin.provideTicketButton', {
                  ticketName: convention.ticket_name,
                })}
              </button>
            </>
          )}
        </div>
      </Form>
    </Modal>
  );
}

export const Component = ProvideTicketModal;
