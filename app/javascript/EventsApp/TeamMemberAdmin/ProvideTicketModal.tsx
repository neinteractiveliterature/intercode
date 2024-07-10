import { useCallback, useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';
import capitalize from 'lodash/capitalize';

import { getProvidableTicketTypes } from './ProvideTicketUtils';
import ProvidableTicketTypeSelection from './ProvidableTicketTypeSelection';
import TicketingStatusDescription from './TicketingStatusDescription';
import useAsyncFunction from '../../useAsyncFunction';
import { TeamMembersQueryData, TeamMembersQueryDocument, TeamMembersQueryVariables } from './queries.generated';
import { ProvideEventTicketMutationVariables, useProvideEventTicketMutation } from './mutations.generated';

export type ProvideTicketModalProps = {
  event: TeamMembersQueryData['convention']['event'];
  convention: NonNullable<TeamMembersQueryData['convention']>;
  onClose: () => void;
  teamMember?: TeamMembersQueryData['convention']['event']['team_members'][0];
  visible: boolean;
};

function ProvideTicketModal({ event, convention, onClose, teamMember, visible }: ProvideTicketModalProps): JSX.Element {
  const { t } = useTranslation();
  const [ticketTypeId, setTicketTypeId] = useState<string>();
  const [provideTicketMutate] = useProvideEventTicketMutation();
  const [provideTicketAsync, error, mutationInProgress] = useAsyncFunction(provideTicketMutate);

  const provideTicket = useCallback(
    (args: { variables: ProvideEventTicketMutationVariables }) =>
      provideTicketAsync({
        ...args,
        update: (store, result) => {
          const data = store.readQuery<TeamMembersQueryData, TeamMembersQueryVariables>({
            query: TeamMembersQueryDocument,
            variables: { eventId: event.id },
          });
          const ticket = result.data?.provideEventTicket?.ticket;
          if (!data || !ticket) {
            return;
          }

          store.writeQuery<TeamMembersQueryData>({
            query: TeamMembersQueryDocument,
            variables: { eventId: event.id },
            data: {
              ...data,
              convention: {
                ...data.convention,
                event: {
                  ...data.convention.event,
                  provided_tickets: [...data.convention.event.provided_tickets, ticket],
                  team_members: data.convention.event.team_members.map((tm) => {
                    if (tm.id !== teamMember?.id) {
                      return tm;
                    }

                    return {
                      ...tm,
                      user_con_profile: {
                        ...tm.user_con_profile,
                        ticket,
                      },
                    };
                  }),
                },
              },
            },
          });
        },
      }),
    [event, provideTicketAsync, teamMember],
  );

  const provideTicketClicked = async () => {
    if (!teamMember || !ticketTypeId) {
      return;
    }

    await provideTicket({
      variables: {
        eventId: event.id,
        userConProfileId: teamMember.user_con_profile.id,
        ticketTypeId,
      },
    });
    onClose();
  };

  if (getProvidableTicketTypes(convention).length < 1) {
    return <></>;
  }

  return (
    <Modal visible={visible}>
      <div className="modal-header">{capitalize(convention.ticketNamePlural)}</div>
      <div className="modal-body">
        {teamMember ? (
          <>
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

        <ErrorDisplay graphQLError={error as ApolloError} />
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
            <button
              type="button"
              className="btn btn-primary"
              disabled={ticketTypeId == null || mutationInProgress}
              onClick={provideTicketClicked}
            >
              {t('events.teamMemberAdmin.provideTicketButton', {
                ticketName: convention.ticket_name,
              })}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}

export default ProvideTicketModal;
