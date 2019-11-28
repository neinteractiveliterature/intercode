/* global Rollbar */
import React from 'react';
import PropTypes from 'prop-types';

import ErrorDisplay from './ErrorDisplay';

class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { error };
  }

  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, info) {
    this.setState({ error });

    if (typeof Rollbar !== 'undefined') {
      Rollbar.error(error, { errorInfo: info });
    }

    if (typeof console !== 'undefined') {
      console.log(error); // eslint-disable-line no-console
      console.log(info); // eslint-disable-line no-console
    }
  }

  render = () => {
    const { errorType, placement, children } = this.props;

    if (!this.state.error) {
      return children;
    }

    const errorDisplayProps = (
      errorType === 'graphql'
        ? { graphQLError: this.state.error }
        : { stringError: this.state.error.message }
    );

    if (placement === 'before') {
      return (
        <>
          <ErrorDisplay {...errorDisplayProps} />
          {children}
        </>
      );
    }

    if (placement === 'replace') {
      return <ErrorDisplay {...errorDisplayProps} />;
    }

    return (
      <>
        {children}
        <ErrorDisplay {...errorDisplayProps} />
      </>
    );
  }
}

ErrorBoundary.propTypes = {
  errorType: PropTypes.oneOf(['graphql', 'plain']),
  placement: PropTypes.oneOf(['before', 'after', 'replace']),
  children: PropTypes.node,
};

ErrorBoundary.defaultProps = {
  errorType: 'graphql',
  placement: 'before',
  children: null,
};

export default ErrorBoundary;
