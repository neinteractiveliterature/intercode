import React, { useCallback, useContext, useEffect } from 'react';
import { GraphiQL } from 'graphiql';
import { parse } from 'graphql';
import { Fetcher } from '@graphiql/toolkit';

import { ApolloLink, execute } from '@apollo/client';
import { useIntercodeApolloLink } from './useIntercodeApolloClient';
import mountReactComponents from './mountReactComponents';

import 'graphiql/graphiql.css';
import './styles/dev-mode-graphiql.scss';
import { AuthenticityTokensContext } from './AuthenticityTokensContext';
import { useApolloClient } from '@apollo/client/react';

export type DevModeGraphiqlProps = {
  authenticityTokens: {
    graphql: string;
  };
};

function DevModeGraphiql({ authenticityTokens }: DevModeGraphiqlProps): React.JSX.Element {
  const manager = useContext(AuthenticityTokensContext);

  useEffect(() => {
    manager.setTokens(authenticityTokens);
  }, [authenticityTokens, manager]);
  const link = useIntercodeApolloLink(new URL('/graphql', window.location.href), manager);
  const client = useApolloClient();

  const fetcher: Fetcher = useCallback(
    (operation) => {
      const operationAsGraphQLRequest = operation as unknown as ApolloLink.Request;

      operationAsGraphQLRequest.query = parse(operation.query);
      return execute(link, operationAsGraphQLRequest, { client });
    },
    [link, client],
  );

  return <GraphiQL fetcher={fetcher} editorTheme="intercode" />;
}

mountReactComponents({ DevModeGraphiql: DevModeGraphiql as React.FC<unknown> });
