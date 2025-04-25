import { OrganizationRole } from 'graphqlTypes.generated';
import { DeleteOrganizationRoleDocument, UpdateOrganizationRoleDocument } from 'OrganizationAdmin/mutations.generated';
import { data, redirect } from 'react-router';
import { Route } from './+types/route';
import { apolloClientContext } from 'AppContexts';

export async function action({ params: { id, organizationRoleId }, request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'DELETE') {
      const result = await context.get(apolloClientContext).mutate({
        mutation: DeleteOrganizationRoleDocument,
        variables: { id: organizationRoleId },
        update: (cache) => {
          cache.modify<OrganizationRole>({
            id: cache.identify({ __typename: 'OrganizationRole', id: organizationRoleId }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
      return data(result.data);
    } else if (request.method === 'PATCH') {
      const json = await request.json();
      await context.get(apolloClientContext).mutate({
        mutation: UpdateOrganizationRoleDocument,
        variables: { id: organizationRoleId, ...json },
      });
      return redirect(`/organizations/${id}`);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}
