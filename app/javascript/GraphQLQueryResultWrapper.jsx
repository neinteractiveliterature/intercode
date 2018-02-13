import React from 'react';
import PropTypes from 'prop-types';
import ErrorDisplay from './ErrorDisplay';
import LoadingIndicator from './LoadingIndicator';

const GraphQLQueryResultWrapper = WrappedComponent => class Wrapper extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.shape({
        message: PropTypes.string.isRequired,
      }),
    }).isRequired,
  };

  static get name() { return `GraphQLQueryResultWrapper(${WrappedComponent.name})`; }

  render = () => {
    const { data } = this.props;

    if (data.loading) {
      return <LoadingIndicator />;
    }
    if (data.error) {
      return <ErrorDisplay graphQLError={data.error} />;
    }

    return <WrappedComponent data={data} {...this.props} />;
  };
};

export default GraphQLQueryResultWrapper;
