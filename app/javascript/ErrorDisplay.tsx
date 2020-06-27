import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { ApolloError } from 'apollo-client';

export type ErrorDisplayProps = {
  stringError?: string | null,
  graphQLError?: ApolloError | null,
};

const ErrorDisplay = ({ stringError, graphQLError }: ErrorDisplayProps) => {
  let displayContents: ReactNode = null;

  if (graphQLError) {
    try {
      if (graphQLError.graphQLErrors.length > 0) {
        const errorMessages = graphQLError.graphQLErrors.map((error, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={i}>{error.message}</li>
        ));

        displayContents = (
          <ul className="list-unstyled m-0">{errorMessages}</ul>
        );
      } else {
        displayContents = <pre>{graphQLError.message}</pre>;
      }
    } catch (formattingError) {
      if (graphQLError.message) {
        displayContents = <pre>{graphQLError.message}</pre>;
      } else {
        displayContents = JSON.stringify(graphQLError);
      }
    }
  } else if (stringError) {
    displayContents = stringError;
  } else {
    return null;
  }

  return (
    <div className="alert alert-danger">{displayContents}</div>
  );
};

ErrorDisplay.propTypes = {
  stringError: PropTypes.string,
  graphQLError: PropTypes.shape({
    graphQLErrors: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string.isRequired,
    })),
    message: PropTypes.string,
  }),
};

ErrorDisplay.defaultProps = {
  stringError: null,
  graphQLError: null,
};

export default ErrorDisplay;
