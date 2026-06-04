import React, { useContext, useLayoutEffect } from 'react';
import GraphQLQueryEditor from './CmsAdmin/CmsGraphqlQueriesAdmin/GraphQLQueryEditor';
import mountReactComponents from './mountReactComponents';
import { AuthenticityTokensContext } from './AuthenticityTokensContext';

export type DevModeGraphiqlProps = {
  authenticityTokens: {
    graphql: string;
  };
};

function DevModeGraphiql({ authenticityTokens }: DevModeGraphiqlProps): React.JSX.Element {
  const manager = useContext(AuthenticityTokensContext);

  // useLayoutEffect runs before any useEffect, so tokens are set before
  // GraphQLQueryEditor's introspection fetch fires.
  useLayoutEffect(() => {
    manager.setTokens(authenticityTokens);
  }, [authenticityTokens, manager]);

  return (
    <div style={{ height: '100vh', padding: '1rem', boxSizing: 'border-box' }}>
      <GraphQLQueryEditor />
    </div>
  );
}

mountReactComponents({ DevModeGraphiql: DevModeGraphiql as React.FC<unknown> });
