import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import usePageTitle from '../../usePageTitle';

import 'graphiql/graphiql.css';
import { useCmsGraphqlQueriesQuery } from './queries.generated';
import { LoadSingleValueFromCollectionWrapper } from '../../GraphqlLoadingWrappers';

export default LoadSingleValueFromCollectionWrapper(
  useCmsGraphqlQueriesQuery,
  (data, id) => data.cmsParent.cmsGraphqlQueries.find((q) => q.id.toString() === id),
  function ViewCmsGraphqlQuerySource({ value: query }) {
    usePageTitle(`View “${query.identifier}” Source`);

    return (
      <>
        <h2 className="mb-4">View GraphQL query source</h2>

        <div className="mb-4">
          <CmsGraphqlQueryForm value={query} readOnly />
        </div>
      </>
    );
  },
);
