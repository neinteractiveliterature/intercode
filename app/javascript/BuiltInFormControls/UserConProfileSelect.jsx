import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import VirtualizedSelect from 'react-virtualized-select';
import createFilterOptions from 'react-select-fast-filter-options';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';

export const DEFAULT_USER_CON_PROFILES_QUERY = gql`
query($cursor: String) {
  convention {
    user_con_profiles(first: 1000, after: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
      }

      edges {
        node {
          id
          name_without_nickname
        }
      }
    }
  }
}
`;

class UserConProfileSelect extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    userConProfilesQuery: PropTypes.shape({
      kind: PropTypes.string.isRequired,
      definitions: PropTypes.array.isRequired,
    }),
  };

  static defaultProps = {
    userConProfilesQuery: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      options: null,
      filterOptions: null,
    };
  }

  // react-select async behavior is broken with multi-select, so for now we'll load all the user
  // con profiles and provide them once to a synchronous select
  //
  // https://github.com/JedWatson/react-select/issues/1771
  componentDidMount = async () => {
    const results = await this.loadOptions();

    this.setState({
      options: results.options,
      filterOptions: createFilterOptions(results.options),
    });
  }

  loadOptions = async (input) => {
    this.setState({ isLoading: true });
    const variables = { name: input };

    let nextVariables = variables;
    let options = [];
    do {
      // no-await-in-loop is based on the assumption that most multi-promise
      // situations are parallelizable.  This one isn't, and the docs say in
      // cases like this to disable the check.
      // eslint-disable-next-line no-await-in-loop
      const results = await this.props.client.query({
        query: this.props.userConProfilesQuery || DEFAULT_USER_CON_PROFILES_QUERY,
        variables: nextVariables,
      });

      const userConProfiles = results.data.convention.user_con_profiles;
      const currentPageOptions = userConProfiles.edges.map(edge => ({
        label: edge.node.name_without_nickname,
        value: edge.node.id,
        data: edge.node,
      }));

      if (userConProfiles.pageInfo.hasNextPage) {
        nextVariables = {
          ...variables,
          cursor: userConProfiles.pageInfo.endCursor,
        };
      } else {
        nextVariables = null;
      }

      options = [...options, ...currentPageOptions];
    } while (nextVariables != null);

    this.setState({ isLoading: false });

    return {
      options,
      complete: (!input || input === ''),
    };
  }

  render = () => {
    if (this.state.isLoading) {
      return (
        <div>
          Loading... <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" />
        </div>
      );
    }

    return (
      <VirtualizedSelect
        options={this.state.options}
        filterOptions={this.state.filterOptions}
        {...this.props}
      />
    );
  }
}

export default withApollo(UserConProfileSelect);
export { UserConProfileSelect as PureUserConProfileSelect };
