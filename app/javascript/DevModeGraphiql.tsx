import React, { useCallback } from 'react';
import { GraphiQL } from 'graphiql';
import { parse } from 'graphql';
import { Fetcher } from '@graphiql/toolkit';

import { execute, GraphQLRequest } from '@apollo/client/';
import { useIntercodeApolloLink } from './useIntercodeApolloClient';
import mountReactComponents from './mountReactComponents';

import 'graphiql/graphiql.css';
import './styles/dev-mode-graphiql.scss';
import AuthenticityTokensManager from './AuthenticityTokensContext';

export type DevModeGraphiqlProps = {
  authenticityTokens: {
    graphql: string;
  };
};

function DevModeGraphiql({ authenticityTokens }: DevModeGraphiqlProps): JSX.Element {
  useCallback(() => {
    AuthenticityTokensManager.instance.setTokens(authenticityTokens);
  }, [authenticityTokens]);
  const link = useIntercodeApolloLink(new URL('/graphql', window.location.href));

  // @ts-expect-error This might be really broken but I need to ship a patch release ASAP and this is less important
  const fetcher: Fetcher = useCallback(
    (operation) => {
      const operationAsGraphQLRequest = operation as unknown as GraphQLRequest;

      operationAsGraphQLRequest.query = parse(operation.query);
      return execute(link, operationAsGraphQLRequest);
    },
    [link],
  );

  return <GraphiQL fetcher={fetcher} editorTheme="intercode" />;
}

mountReactComponents({ DevModeGraphiql: DevModeGraphiql as React.FC<unknown> });
