import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { CmsGraphqlQueriesQuery } from './queries.gql';
import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import { CreateCmsGraphqlQuery } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';

import 'graphiql/graphiql.css';

class NewCmsGraphqlQuery extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      query: {
        identifier: '',
        admin_notes: '',
        query: '',
      },
      mutationInProgress: false,
      error: null,
    };
  }

  render = () => (
    <>
      <h2 className="mb-4">New GraphQL query</h2>

      <div className="mb-4">
        <CmsGraphqlQueryForm
          value={this.state.query}
          onChange={(query) => { this.setState({ query }); }}
        />
      </div>

      <ErrorDisplay graphQLError={this.state.error} />

      <Mutation mutation={CreateCmsGraphqlQuery}>
        {mutate => (
          <button
            type="button"
            className="btn btn-primary"
            disabled={this.state.mutationInProgress}
            onClick={async () => {
              try {
                this.setState({ mutationInProgress: true });
                await mutate({
                  variables: {
                    query: {
                      identifier: this.state.query.identifier,
                      admin_notes: this.state.query.admin_notes,
                      query: this.state.query.query,
                    },
                  },
                  update: (cache, { data: { createCmsGraphqlQuery: { query } } }) => {
                    const data = cache.readQuery({ query: CmsGraphqlQueriesQuery });

                    cache.writeQuery({
                      query: CmsGraphqlQueriesQuery,
                      data: {
                        ...data,
                        cmsGraphqlQueries: [
                          ...data.cmsGraphqlQueries,
                          query,
                        ],
                      },
                    });
                  },
                });

                this.props.history.push('/cms_graphql_queries');
              } catch (error) {
                this.setState({ error, mutationInProgress: false });
              }
            }}
          >
            Create GraphQL query
          </button>
        )}
      </Mutation>
    </>
  )
}

export default withRouter(NewCmsGraphqlQuery);
