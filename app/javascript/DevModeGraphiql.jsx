import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import GraphiQL from 'graphiql';
import { parse } from 'graphql';

import { execute } from 'apollo-link';
import { useIntercodeApolloLink } from './useIntercodeApolloClient';
import mountReactComponents from './mountReactComponents';

import 'graphiql/graphiql.css';
import './styles/dev-mode-graphiql.scss';

function DevModeGraphiql({ authenticityTokens: { graphql: authenticityToken } }) {
  const onUnauthenticated = useRef(() => {});
  const link = useIntercodeApolloLink(authenticityToken, onUnauthenticated);

  const fetcher = useCallback(
    (operation) => {
      // eslint-disable-next-line no-param-reassign
      operation.query = parse(operation.query);
      return execute(link, operation);
    },
    [link],
  );

  return <GraphiQL fetcher={fetcher} editorTheme="intercode" />;
}

DevModeGraphiql.propTypes = {
  authenticityTokens: PropTypes.shape({
    graphql: PropTypes.string.isRequired,
  }).isRequired,
};

mountReactComponents({ DevModeGraphiql });
