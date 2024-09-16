import {
  ActionFunction,
  Navigate,
  redirect,
  useActionData,
  useNavigation,
  useRouteLoaderData,
  useSubmit,
} from 'react-router-dom';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import useOrganizationRoleForm from './useOrganizationRoleForm';
import usePageTitle from '../usePageTitle';
import { OrganizationRoleFieldsFragmentDoc } from './queries.generated';
import { NamedRoute } from '../AppRouter';
import { SingleOrganizationLoaderResult } from './loaders';
import invariant from 'tiny-invariant';
import { CreateOrganizationRoleDocument, CreateOrganizationRoleMutationVariables } from './mutations.generated';
import { client } from 'useIntercodeApolloClient';
import { Organization } from 'graphqlTypes.generated';
import { ApolloError } from '@apollo/client';

type ActionRequest = Omit<CreateOrganizationRoleMutationVariables, 'organizationId'>;

export const action: ActionFunction = async ({ request, params: { id } }) => {
  try {
    if (request.method === 'POST') {
      invariant(id != null);
      const variables = (await request.json()) as ActionRequest;

      await client.mutate({
        mutation: CreateOrganizationRoleDocument,
        variables: {
          organizationId: id,
          ...variables,
        },
        update: (cache, result) => {
          const organizationRole = result.data?.createOrganizationRole.organization_role;
          if (organizationRole != null) {
            const ref = cache.writeFragment({ fragment: OrganizationRoleFieldsFragmentDoc, data: organizationRole });
            cache.modify<Organization>({
              id: cache.identify({ __typename: 'Organization', id }),
              fields: {
                organization_roles: (value) => [...value, ref],
              },
            });
          }
        },
      });

      return redirect(`/organizations/${id}`);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

function NewOrganizationRole() {
  const organization = useRouteLoaderData(NamedRoute.Organization) as SingleOrganizationLoaderResult;
  const { renderForm, formState } = useOrganizationRoleForm({
    __typename: 'OrganizationRole',
    id: '',
    name: '',
    users: [],
    permissions: [],
  });
  const submit = useSubmit();
  const actionData = useActionData();
  const mutationError = actionData instanceof Error ? actionData : undefined;
  const mutationInProgress = useNavigation().state !== 'idle';

  usePageTitle('New organization role');

  if (!organization.current_ability_can_manage_access) {
    return <Navigate to="/organizations" />;
  }

  const createOrganizationRole = () => {
    submit(
      {
        name: formState.name,
        userIds: formState.usersChangeSet.getAddValues().map((user) => user.id),
        permissions: formState.permissionsChangeSet.getAddValues().map((permission) => ({
          permission: permission.permission,
        })),
      } satisfies ActionRequest,
      { encType: 'application/json', method: 'POST' },
    );
  };

  return (
    <>
      <h1 className="mb-4">New role in {organization.name}</h1>

      {renderForm()}

      <ErrorDisplay graphQLError={mutationError as ApolloError} />

      <button className="btn btn-primary" type="button" onClick={createOrganizationRole} disabled={mutationInProgress}>
        Create role
      </button>
    </>
  );
}

export const Component = NewOrganizationRole;
