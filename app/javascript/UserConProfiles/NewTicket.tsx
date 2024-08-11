import { useCallback } from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';

import TicketForm from './TicketForm';
import usePageTitle from '../usePageTitle';
import { UserConProfileAdminQueryData, UserConProfileAdminQueryDocument } from './queries.generated';
import { useCreateTicketMutation } from './mutations.generated';
import { TicketInput } from '../graphqlTypes.generated';
import { NamedRoute } from '../AppRouter';

function NewTicket() {
  const data = useRouteLoaderData(NamedRoute.AdminUserConProfile) as UserConProfileAdminQueryData;
  const navigate = useNavigate();
  const [createTicket] = useCreateTicketMutation({
    update: (cache, result) => {
      const cacheData = cache.readQuery<UserConProfileAdminQueryData>({
        query: UserConProfileAdminQueryDocument,
        variables: { id: data.convention.user_con_profile.id },
      });
      if (!cacheData) {
        return;
      }

      cache.writeQuery<UserConProfileAdminQueryData>({
        query: UserConProfileAdminQueryDocument,
        variables: { id: data.convention.user_con_profile.id },
        data: {
          ...cacheData,
          convention: {
            ...cacheData.convention,
            user_con_profile: {
              ...cacheData.convention.user_con_profile,
              ticket: result.data?.createTicket?.ticket,
            },
          },
        },
      });
    },
  });

  const onSubmit = useCallback(
    async (ticketInput: TicketInput) => {
      if (data.convention.user_con_profile.id == null) {
        throw new Error('userConProfileId not found in params');
      }
      await createTicket({
        variables: {
          userConProfileId: data.convention.user_con_profile.id,
          ticket: ticketInput,
        },
      });
      navigate(`/user_con_profiles/${data.convention.user_con_profile.id}`);
    },
    [createTicket, navigate, data.convention.user_con_profile.id],
  );

  usePageTitle(`New ${data.convention.ticket_name} for ${data.convention.user_con_profile.name}`);

  const { convention } = data;
  const userConProfile = convention.user_con_profile;

  return (
    <>
      <h1 className="mb-4">
        {'Create '}
        {convention.name} {convention.ticket_name}
        {' for '}
        {userConProfile.name}
      </h1>

      <TicketForm
        convention={convention}
        initialTicket={{
          ticket_type: undefined,
          provided_by_event: null,
        }}
        onSubmit={onSubmit}
        submitCaption={`Create ${convention.ticket_name}`}
        userConProfile={userConProfile}
      />
    </>
  );
}

export const Component = NewTicket;
