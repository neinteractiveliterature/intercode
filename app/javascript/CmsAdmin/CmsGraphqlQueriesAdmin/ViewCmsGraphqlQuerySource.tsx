import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import usePageTitle from '../../usePageTitle';

import 'graphiql/graphiql.css';
import { useLoaderData } from 'react-router';
import { singleCmsGraphqlQueryAdminLoader, SingleCmsGraphqlQueryAdminLoaderResult } from './loaders';

export const loader = singleCmsGraphqlQueryAdminLoader;

function ViewCmsGraphqlQuerySource() {
  const { graphqlQuery: query } = useLoaderData() as SingleCmsGraphqlQueryAdminLoaderResult;
  usePageTitle(`View “${query.identifier}” Source`);

  return (
    <>
      <h2 className="mb-4">View GraphQL query source</h2>

      <div className="mb-4">
        <CmsGraphqlQueryForm value={query} readOnly />
      </div>
    </>
  );
}

export const Component = ViewCmsGraphqlQuerySource;
