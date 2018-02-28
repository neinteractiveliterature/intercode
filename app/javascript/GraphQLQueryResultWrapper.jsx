import React from 'react';
import PropTypes from 'prop-types';
import ErrorDisplay from './ErrorDisplay';
import LoadingIndicator from './LoadingIndicator';

const GraphQLQueryResultWrapper = (WrappedComponent) => {
  const wrapper = (props) => {
    const { data } = props;

    if (data.loading) {
      return <LoadingIndicator />;
    }
    if (data.error) {
      return <ErrorDisplay graphQLError={data.error} />;
    }

    return <WrappedComponent data={data} {...props} />;
  };

  wrapper.propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.shape({
        message: PropTypes.string.isRequired,
      }),
    }).isRequired,
  };

  const wrappedComponentDisplayName = (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  );

  wrapper.displayName = `GraphQLQueryResultWrapper(${wrappedComponentDisplayName})`;

  return wrapper;
};

export default GraphQLQueryResultWrapper;
