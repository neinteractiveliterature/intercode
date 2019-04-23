import React from 'react';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';

import { CmsGraphqlQueriesQuery } from './queries.gql';
import Confirm from '../../ModalDialogs/Confirm';
import { DeleteCmsGraphqlQuery } from './mutations.gql';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';

function CmsGraphqlQueriesAdminTable() {
  return (
    <QueryWithStateDisplay query={CmsGraphqlQueriesQuery}>
      {({ data }) => (
        <>
          <table className="table table-striped">
            <tbody>
              {data.cmsGraphqlQueries.map(query => (
                <tr key={query.id}>
                  <td>
                    <code>{query.identifier}</code>
                    {
                      query.admin_notes
                        ? (
                          <>
                            <br />
                            {query.admin_notes}
                          </>
                        )
                        : null
                    }
                  </td>
                  <td className="text-right">
                    <Link to={`/cms_graphql_queries/${query.id}/edit`} className="btn btn-sm btn-secondary mr-2">Edit</Link>
                    <Mutation mutation={DeleteCmsGraphqlQuery}>
                      {mutate => (
                        <Confirm.Trigger>
                          {confirm => (
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => confirm({
                                prompt: `Are you sure you want to delete the query '${query.identifier}'?`,
                                action: () => mutate({
                                  variables: { id: query.id },
                                  update: (cache) => {
                                    const cachedData = cache.readQuery({
                                      query: CmsGraphqlQueriesQuery,
                                    });
                                    cache.writeQuery({
                                      query: CmsGraphqlQueriesQuery,
                                      data: {
                                        ...cachedData,
                                        cmsGraphqlQueries: data.cmsGraphqlQueries
                                          .filter(q => q.id !== query.id),
                                      },
                                    });
                                  },
                                }),
                              })}
                            >
                              Delete
                            </button>
                          )}
                        </Confirm.Trigger>
                      )}
                    </Mutation>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/cms_graphql_queries/new" className="btn btn-primary">
            New GraphQL query
          </Link>
        </>
      )}
    </QueryWithStateDisplay>
  );
}

export default CmsGraphqlQueriesAdminTable;
