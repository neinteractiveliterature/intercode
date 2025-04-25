import { OrganizationRole } from 'graphqlTypes.generated';
import { DeleteOrganizationRoleDocument, UpdateOrganizationRoleDocument } from 'OrganizationAdmin/mutations.generated';
import { ActionFunction, data, redirect } from 'react-router';
import { client } from 'useIntercodeApolloClient';

export const action: ActionFunction = async ({ params: { id, organizationRoleId }, request }) => {
  try {
    if (request.method === 'DELETE') {
      const result = await client.mutate({
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
      await client.mutate({
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
};
