import React, { useCallback } from 'react';
import { GraphiQL } from 'graphiql';
import { parse } from 'graphql';
import { Fetcher } from '@graphiql/toolkit';

import { execute, GraphQLRequest } from '@apollo/client/';
import { useIntercodeApolloLink } from './useIntercodeApolloClient';
import mountReactComponents from './mountReactComponents';

import 'graphiql/graphiql.css';
import './styles/dev-mode-graphiql.scss';

export type DevModeGraphiqlProps = {
  authenticityTokens: {
    graphql: string;
  };
};

function DevModeGraphiql({
  authenticityTokens: { graphql: authenticityToken },
}: DevModeGraphiqlProps): JSX.Element {
  const link = useIntercodeApolloLink(authenticityToken);

  // @ts-expect-error We're doing some shenanigans on the fetcher to adapt it to Apollo Link
  const fetcher: Fetcher = useCallback(
    (operation) => {
      const operationAsGraphQLRequest = operation as unknown as GraphQLRequest;
      // eslint-disable-next-line no-param-reassign
      operationAsGraphQLRequest.query = parse(operation.query);
      return execute(link, operationAsGraphQLRequest);
    },
    [link],
  );

  return <GraphiQL fetcher={fetcher} editorTheme="intercode" />;
}

mountReactComponents({ DevModeGraphiql: DevModeGraphiql as React.FC<unknown> });
