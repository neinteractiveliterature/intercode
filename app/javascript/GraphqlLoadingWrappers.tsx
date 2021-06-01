/* eslint-disable import/prefer-default-export */
import { QueryHookOptions, QueryResult } from '@apollo/client';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import FourOhFourPage from './FourOhFourPage';

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
