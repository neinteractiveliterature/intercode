import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import usePageTitle from '../../usePageTitle';

import 'graphiql/graphiql.css';
import { Route } from './+types/ViewCmsGraphqlQuerySource';
import { CmsGraphqlQueryQueryDocument } from './queries.generated';
import { apolloClientContext } from 'AppContexts';

export async function loader({ context, params: { id } }: Route.LoaderArgs) {
  const { data } = await context
    .get(apolloClientContext)
    .query({ query: CmsGraphqlQueryQueryDocument, variables: { id } });
  return data;
}

function ViewCmsGraphqlQuerySource({
  loaderData: {
    cmsParent: { cmsGraphqlQuery: query },
  },
}: Route.ComponentProps) {
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
