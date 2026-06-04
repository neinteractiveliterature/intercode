import React, { Component, useContext, useLayoutEffect } from 'react';
import GraphQLQueryEditor from './CmsAdmin/CmsGraphqlQueriesAdmin/GraphQLQueryEditor';
import mountReactComponents from './mountReactComponents';
import { AuthenticityTokensContext } from './AuthenticityTokensContext';
import './styles/application.scss';

export type DevModeGraphiqlProps = {
  authenticityTokens: {
    graphql: string;
  };
};

type ErrorBoundaryState = { error: Error | null };

class ErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '1rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: 'red' }}>
          <strong>Error rendering GraphQL editor:</strong>
          {'\n'}
          {this.state.error.stack ?? this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

function DevModeGraphiql({ authenticityTokens }: DevModeGraphiqlProps): React.JSX.Element {
  const manager = useContext(AuthenticityTokensContext);

  // useLayoutEffect runs before any useEffect, so tokens are set before
  // GraphQLQueryEditor's introspection fetch fires.
  useLayoutEffect(() => {
    manager.setTokens(authenticityTokens);
  }, [authenticityTokens, manager]);

  return (
    <ErrorBoundary>
      <div style={{ height: '100vh', padding: '1rem', boxSizing: 'border-box' }}>
        <GraphQLQueryEditor />
      </div>
    </ErrorBoundary>
  );
}

mountReactComponents({ DevModeGraphiql: DevModeGraphiql as React.FC<unknown> });
