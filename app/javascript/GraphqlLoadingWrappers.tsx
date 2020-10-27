/* eslint-disable import/prefer-default-export */
import { QueryHookOptions, QueryResult } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import ErrorDisplay from './ErrorDisplay';
import FourOhFourPage from './FourOhFourPage';
import PageLoadingIndicator from './PageLoadingIndicator';

export function LoadQueryWrapper<TData, TProps>(
  useLoadData: (baseOptions?: QueryHookOptions<TData, {}>) => QueryResult<TData>,
  WrappedComponent: React.ComponentType<TProps & { data: TData }>,
): (props: TProps) => JSX.Element {
  const Wrapper = (props: TProps) => {
    const { data, loading, error } = useLoadData();

    if (loading) {
      return <PageLoadingIndicator visible />;
    }

    if (error) {
      return <ErrorDisplay graphQLError={error} />;
    }

    return <WrappedComponent data={data!} {...props} />;
  };

  const wrappedComponentDisplayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  Wrapper.displayName = `LoadQueryWrapper(${wrappedComponentDisplayName})`;

  return Wrapper;
}

export function LoadSingleValueFromCollectionWrapper<TData, TValue, TProps>(
  useLoadData: (baseOptions?: QueryHookOptions<TData, {}>) => QueryResult<TData>,
  getValue: (data: TData, id: string) => TValue | undefined,
  WrappedComponent: React.ComponentType<TProps & { value: TValue; data: TData }>,
): (props: TProps) => JSX.Element {
  const Wrapper = (props: TProps) => {
    const { id } = useParams<{ id: string }>();
    const { data, loading, error } = useLoadData();
    const value = error || loading || !data ? undefined : getValue(data, id);

    if (loading) {
      return <PageLoadingIndicator visible />;
    }

    if (error) {
      return <ErrorDisplay graphQLError={error} />;
    }

    if (!value) {
      return <FourOhFourPage />;
    }

    return <WrappedComponent value={value} data={data!} {...props} />;
  };

  const wrappedComponentDisplayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  Wrapper.displayName = `LoadSingleValueFromCollectionWrapper(${wrappedComponentDisplayName})`;

  return Wrapper;
}
