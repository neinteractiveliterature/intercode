import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import usePageTitle from '../../usePageTitle';

import { useLoaderData } from 'react-router';
import { singleCmsGraphqlQueryAdminLoader } from './loaders';

export const clientLoader = singleCmsGraphqlQueryAdminLoader;

function ViewCmsGraphqlQuerySource() {
  const { graphqlQuery: query } = useLoaderData<typeof clientLoader>();
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

export default ViewCmsGraphqlQuerySource;
