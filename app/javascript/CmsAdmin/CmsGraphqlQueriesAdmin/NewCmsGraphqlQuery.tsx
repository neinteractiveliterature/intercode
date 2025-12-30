import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router';
import { Route } from './+types/NewCmsGraphqlQuery';

import { ErrorDisplay } from '@neinteractiveliterature/litform';

import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import usePageTitle from '../../usePageTitle';

import 'graphiql/graphiql.css';
import { CreateCmsGraphqlQueryDocument } from './mutations.generated';
import { apolloClientContext } from '../../AppContexts';
import { buildCmsGraphqlQueryInputFromFormData } from './buildCmsGraphqlQueryInput';

export const clientAction = async ({ request, context }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  const formData = await request.formData();

  try {
    await client.mutate({
      mutation: CreateCmsGraphqlQueryDocument,
      variables: {
        query: buildCmsGraphqlQueryInputFromFormData(formData),
      },
    });
  } catch (e) {
    return e;
  }
  await client.resetStore();

  return redirect('/cms_graphql_queries');
};

function NewCmsGraphqlQuery(): React.JSX.Element {
  const [query, setQuery] = useState({ identifier: '', admin_notes: '', query: '' });
  const createError = useActionData();
  const navigation = useNavigation();

  usePageTitle('CMS GraphQL Queries');

  return (
    <Form action="." method="POST">
      <h2 className="mb-4">New GraphQL query</h2>

      <div className="mb-4">
        <CmsGraphqlQueryForm value={query} onChange={setQuery} />
      </div>

      <ErrorDisplay graphQLError={createError} />

      <button type="submit" className="btn btn-primary" disabled={navigation.state !== 'idle'}>
        Create GraphQL query
      </button>
    </Form>
  );
}

export const Component = NewCmsGraphqlQuery;
