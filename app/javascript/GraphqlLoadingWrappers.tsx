import { ApolloError, QueryHookOptions, QueryResult } from '@apollo/client';
import * as React from 'react';
import { Params, useParams } from 'react-router-dom';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import FourOhFourPage from './FourOhFourPage';

export function LoadQueryFromParamsWrapper<
  ParamsOrKey extends string | Record<string, string | undefined>,
  TData,
  TVariables,
  TProps,
>(
  useLoadData: (baseOptions?: QueryHookOptions<TData, TVariables>) => QueryResult<TData>,
  getVariables: (
    params: Readonly<[ParamsOrKey] extends [string] ? Params<ParamsOrKey> : Partial<ParamsOrKey>>,
  ) => TVariables,
  WrappedComponent: React.ComponentType<TProps & { data: TData }>,
) {
  const Wrapper = (props: TProps) => {
    const params = useParams<ParamsOrKey>();
    const variables = React.useMemo(() => getVariables(params), [params]);
    const { data, loading, error } = useLoadData({ variables });

    if (loading) {
      return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
    }

    if (error) {
      if (error instanceof ApolloError && error.graphQLErrors.some((err) => err.extensions?.code === 'NOT_FOUND')) {
        return <FourOhFourPage />;
      }

      return <ErrorDisplay graphQLError={error} />;
    }

    if (!data) {
      return <FourOhFourPage />;
    }

    return <WrappedComponent data={data} {...props} />;
  };

  const wrappedComponentDisplayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  Wrapper.displayName = `LoadQueryFromParamsWrapper(${wrappedComponentDisplayName})`;

  return Wrapper;
}

export function LoadQueryWithVariablesWrapper<TData, TVariables, TProps>(
  useLoadData: (baseOptions?: QueryHookOptions<TData, TVariables>) => QueryResult<TData>,
  getVariables: (props: TProps) => TVariables,
  WrappedComponent: React.ComponentType<TProps & { data: TData }>,
): (props: TProps) => JSX.Element {
  const Wrapper = (props: TProps) => {
    const variables = React.useMemo(() => getVariables(props), [props]);
    const { data, loading, error } = useLoadData({ variables });

    if (loading) {
      return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
    }

    if (error) {
      if (error instanceof ApolloError && error.graphQLErrors.some((err) => err.extensions?.code === 'NOT_FOUND')) {
        return <FourOhFourPage />;
      }

      return <ErrorDisplay graphQLError={error} />;
    }

    if (!data) {
      return <FourOhFourPage />;
    }

    return <WrappedComponent data={data} {...props} />;
  };

  const wrappedComponentDisplayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  Wrapper.displayName = `LoadQueryWithVariablesWrapper(${wrappedComponentDisplayName})`;

  return Wrapper;
}

export function LoadSingleValueFromCollectionWrapper<TData, TValue, TProps>(
  useLoadData: (baseOptions?: QueryHookOptions<TData, unknown>) => QueryResult<TData>,
  getValue: (data: TData, id: string) => TValue | undefined,
  WrappedComponent: React.ComponentType<TProps & { value: TValue; data: TData }>,
): (props: TProps) => JSX.Element {
  const Wrapper = (props: TProps) => {
    const { id } = useParams<{ id: string }>();
    if (id == null) {
      throw new Error('id not found in URL params');
    }
    const { data, loading, error } = useLoadData();
    const value = error || loading || !data ? undefined : getValue(data, id);

    if (loading) {
      return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
    }

    if (error) {
      return <ErrorDisplay graphQLError={error} />;
    }

    if (!data || !value) {
      return <FourOhFourPage />;
    }

    return <WrappedComponent value={value} data={data} {...props} />;
  };

  const wrappedComponentDisplayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  Wrapper.displayName = `LoadSingleValueFromCollectionWrapper(${wrappedComponentDisplayName})`;

  return Wrapper;
}
