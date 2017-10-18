import React from 'react';
import { graphql, gql } from 'react-apollo';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import StandaloneGraphQLComponent from '../StandaloneGraphQLComponent';

const conventionQuery = gql`
query($id: Int!) {
  convention(id: $id) {
    accepting_bids
    precon_bids_allowed
    created_at
    updated_at
    starts_at
    ends_at
    name
    domain
    timezone_name
    registrations_frozen

    rooms {
      id
      name
    }
  }
}
`;

@StandaloneGraphQLComponent
@graphql(conventionQuery)
@GraphQLQueryResultWrapper
class ConventionAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(conventionQuery, 'convention').isRequired,
  };

  render = () => {
    return <div>{this.props.data.convention.name}</div>;
  }
}

export default ConventionAdmin;
