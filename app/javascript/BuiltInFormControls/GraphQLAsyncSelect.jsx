import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import AsyncSelect from 'react-select/async';

class GraphQLAsyncSelect extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    query: PropTypes.shape({}).isRequired,
    getOptions: PropTypes.func.isRequired,
    getVariables: PropTypes.func.isRequired,
  };

  loadOptions = async (inputValue) => {
    const results = await this.props.client.query({
      query: this.props.query,
      variables: this.props.getVariables(inputValue),
    });

    return this.props.getOptions(results.data);
  }

  render = () => (
    <AsyncSelect
      handleInputChange={input => input.toLowerCase().trim()}
      loadOptions={this.loadOptions}
      {...this.props}
    />
  )
}

export default withApollo(GraphQLAsyncSelect);
export { GraphQLAsyncSelect as PureGraphQLAsyncSelect };
