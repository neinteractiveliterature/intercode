import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from './LoadingIndicator';

const GraphQLQueryResultWrapper = (WrappedComponent) => {
  const wrapper = ({ data, ...props }) => {
    if (data.loading) {
      return <LoadingIndicator />;
    }
    if (data.error) {
      return <div className="alert alert-danger">{data.error.message}</div>;
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

  return wrapper;
};

export default GraphQLQueryResultWrapper;
