import React from 'react';
import PropTypes from 'prop-types';

import ErrorDisplay from './ErrorDisplay';

class ErrorBoundary extends React.Component {
  static propTypes = {
    errorType: PropTypes.oneOf(['graphql', 'plain']),
    placement: PropTypes.oneOf(['before', 'after']),
    children: PropTypes.node,
  };

  static defaultProps = {
    errorType: 'graphql',
    placement: 'before',
    children: null,
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  render = () => {
    const { errorType, placement, children } = this.props;

    const errorDisplayProps = (
      errorType === 'graphql'
        ? { graphQLError: this.state.error }
        : { error: this.state.error }
    );

    if (placement === 'before') {
      return (
        <>
          <ErrorDisplay {...errorDisplayProps} />
          {children}
        </>
      );
    }

    return (
      <>
        {children}
        <ErrorDisplay {...errorDisplayProps} />
      </>
    );
  }
}

export default ErrorBoundary;
