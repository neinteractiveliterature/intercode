import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import { UpdateCmsGraphqlQuery } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';

import 'graphiql/graphiql.css';

class EditCmsGraphqlQuery extends React.Component {
  static propTypes = {
    initialQuery: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      admin_notes: PropTypes.string.isRequired,
      query: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      query: props.initialQuery,
      mutationInProgress: false,
      error: null,
    };
  }

  render = () => (
    <>
      <h2 className="mb-4">Edit GraphQL query</h2>

      <div className="mb-4">
        <CmsGraphqlQueryForm
          value={this.state.query}
          onChange={(query) => { this.setState({ query }); }}
        />
      </div>

      <ErrorDisplay graphQLError={this.state.error} />

      <Mutation mutation={UpdateCmsGraphqlQuery}>
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
                    id: this.state.query.id,
                    query: {
                      identifier: this.state.query.identifier,
                      admin_notes: this.state.query.admin_notes,
                      query: this.state.query.query,
                    },
                  },
                });

                this.props.history.push('/cms_graphql_queries');
              } catch (error) {
                this.setState({ error, mutationInProgress: false });
              }
            }}
          >
            Save GraphQL query
          </button>
        )}
      </Mutation>
    </>
  )
}

export default withRouter(EditCmsGraphqlQuery);
