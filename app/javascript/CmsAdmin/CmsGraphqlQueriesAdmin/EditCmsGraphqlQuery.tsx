import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { ActionFunction, Form, redirect, useActionData, useLoaderData, useNavigation } from 'react-router';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import usePageTitle from '../../usePageTitle';

import 'graphiql/graphiql.css';
import { singleCmsGraphqlQueryAdminLoader, SingleCmsGraphqlQueryAdminLoaderResult } from './loaders';
import { client } from '../../useIntercodeApolloClient';
import { UpdateCmsGraphqlQueryDocument } from './mutations.generated';
import { buildCmsGraphqlQueryInputFromFormData } from './buildCmsGraphqlQueryInput';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  const formData = await request.formData();

  try {
    await client.mutate({
      mutation: UpdateCmsGraphqlQueryDocument,
      variables: {
        id: id ?? '',
        query: buildCmsGraphqlQueryInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await client.resetStore();

  return redirect(formData.get('destination')?.toString() ?? '/cms_graphql_queries');
};

export const loader = singleCmsGraphqlQueryAdminLoader;

function EditCmsGraphqlQuery() {
  const { graphqlQuery: initialQuery } = useLoaderData() as SingleCmsGraphqlQueryAdminLoaderResult;
  const [query, setQuery] = useState(initialQuery);
  const navigation = useNavigation();
  const saveError = useActionData();

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

export const Component = EditCmsGraphqlQuery;
