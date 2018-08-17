import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import ErrorDisplay from './ErrorDisplay';
import LoadingIndicator from './LoadingIndicator';

const QueryWithStateDisplay = ({ children, ...props }) => (
  <Query {...props}>
    {({
      data, loading, error, ...otherArgs
    }) => {
      if (loading) {
        return <LoadingIndicator />;
      }
      if (error) {
        return <ErrorDisplay graphQLError={error} />;
      }

      return children({
        data, loading, error, ...otherArgs,
      });
    }}
  </Query>
);

export default QueryWithStateDisplay;
