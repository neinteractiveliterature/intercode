import 'graphiql/graphiql.css';
import { GraphiQL } from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { useContext, useMemo } from 'react';
import { AuthenticityTokensContext } from '../../AuthenticityTokensContext';
import { getIntercodeUserTimezoneHeader } from '../../useIntercodeApolloClient';

type GraphiQLWithFetcherProps = {
  defaultQuery?: string;
  onEditQuery?: (query: string) => void;
};

export default function GraphiQLWithFetcher({ defaultQuery, onEditQuery }: GraphiQLWithFetcherProps) {
  const manager = useContext(AuthenticityTokensContext);
  const authenticityToken = manager.tokens?.graphql;

  const fetcher = useMemo(
    () =>
      createGraphiQLFetcher({
        url: '/graphql',
        headers: { 'X-CSRF-Token': authenticityToken ?? '', ...getIntercodeUserTimezoneHeader() },
      }),
    [authenticityToken],
  );

  return <GraphiQL defaultQuery={defaultQuery} onEditQuery={onEditQuery} fetcher={fetcher} />;
}
