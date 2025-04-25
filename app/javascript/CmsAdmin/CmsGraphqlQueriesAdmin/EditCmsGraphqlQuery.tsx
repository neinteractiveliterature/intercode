import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { Form, redirect, useNavigation } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import usePageTitle from '../../usePageTitle';

import 'graphiql/graphiql.css';
import { UpdateCmsGraphqlQueryDocument } from './mutations.generated';
import { buildCmsGraphqlQueryInputFromFormData } from './buildCmsGraphqlQueryInput';
import { Route } from './+types/EditCmsGraphqlQuery';
import { CmsGraphqlQueryQueryDocument } from './queries.generated';
import { apolloClientContext } from 'AppContexts';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    await context.get(apolloClientContext).mutate({
      mutation: UpdateCmsGraphqlQueryDocument,
      variables: {
        id: id ?? '',
        query: buildCmsGraphqlQueryInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await context.get(apolloClientContext).resetStore();

  return redirect(formData.get('destination')?.toString() ?? '/cms_graphql_queries');
}

export async function loader({ context, params: { id } }: Route.LoaderArgs) {
  const { data } = await context
    .get(apolloClientContext)
    .query({ query: CmsGraphqlQueryQueryDocument, variables: { id } });
  return data;
}

function EditCmsGraphqlQuery({
  loaderData: {
    cmsParent: { cmsGraphqlQuery: initialQuery },
  },
  actionData: saveError,
}: Route.ComponentProps) {
  const [query, setQuery] = useState(initialQuery);
  const navigation = useNavigation();

  const saveInProgress = navigation.state !== 'idle';

  usePageTitle(`Editing “${initialQuery.identifier}”`);

  return (
    <Form action="." method="PATCH">
      <h2 className="mb-4">Edit GraphQL query</h2>

      <div className="mb-4">
        <CmsGraphqlQueryForm value={query} readOnly={saveInProgress} onChange={setQuery} />
      </div>

      <ErrorDisplay graphQLError={saveError as ApolloError} />

      <button type="submit" className="btn btn-primary" disabled={saveInProgress}>
        Save GraphQL query
      </button>
    </Form>
  );
}

export default EditCmsGraphqlQuery;
