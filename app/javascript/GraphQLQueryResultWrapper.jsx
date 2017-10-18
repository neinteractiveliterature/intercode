import React from 'react';
import PropTypes from 'prop-types';
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
      return <div className="alert alert-danger">{data.error.message}</div>;
    }

    return <WrappedComponent data={data} {...this.props} />;
  };
};

export default GraphQLQueryResultWrapper;
