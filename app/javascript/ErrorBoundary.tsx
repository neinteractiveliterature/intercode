/* eslint-disable max-classes-per-file */
/// <reference path="./@types/globals.d.ts" />
import { Component, ReactNode, ErrorInfo } from 'react';
import { ApolloError } from '@apollo/client';

import ErrorDisplay from './ErrorDisplay';

export type ErrorBoundaryProps = {
  errorType?: 'graphql' | 'plain';
  placement?: 'before' | 'after' | 'replace';
  children?: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(error: any) {
    return { error };
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
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
    const errorType = this.props.errorType ?? 'graphql';
    const placement = this.props.placement ?? 'before';
    const { children } = this.props;

    if (!this.state.error) {
      return children;
    }

    const errorDisplayProps =
      (errorType ?? 'graphql') === 'graphql'
        ? { graphQLError: this.state.error as ApolloError }
        : { stringError: this.state.error.message };

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
  };
}

export default ErrorBoundary;
