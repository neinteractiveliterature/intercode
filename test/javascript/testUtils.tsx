/* eslint-disable import/export */
import { useMemo } from 'react';

import * as React from 'react';
import { MockedProvider, MockedProviderProps } from '@apollo/client/testing';
import { render, queries, Queries, RenderOptions, RenderResult } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import Confirm from '../../app/javascript/ModalDialogs/Confirm';
import { LazyStripeContext } from '../../app/javascript/LazyStripe';

export type TestWrapperProps = {
  apolloMocks?: MockedProviderProps['mocks'];
  children?: React.ReactNode;
  stripePublishableKey?: string;
};

function TestWrapper({ apolloMocks, stripePublishableKey, children }: TestWrapperProps) {
  const history = useMemo(() => createMemoryHistory(), []);
  const lazyStripeProviderValue = useMemo(() => ({ publishableKey: stripePublishableKey }), [
    stripePublishableKey,
  ]);
  return (
    <Router history={history}>
      <MockedProvider mocks={apolloMocks}>
        <LazyStripeContext.Provider value={lazyStripeProviderValue}>
          <Confirm>{children}</Confirm>
        </LazyStripeContext.Provider>
      </MockedProvider>
    </Router>
  );
}

export type CustomQueries = {
  getMultipleChoiceInput: (
    container: HTMLElement,
    formGroupLegendText: string,
    labelText: string,
  ) => HTMLInputElement | null;
};

const customQueries: CustomQueries = {
  getMultipleChoiceInput: (
    container: HTMLElement,
    formGroupLegendText: string,
    labelText: string,
  ) => {
    const formGroup = queries
      .getByText(container, formGroupLegendText, { selector: 'legend' })
      .closest<HTMLElement>('.form-group');
    return formGroup ? (queries.getByLabelText(formGroup, labelText) as HTMLInputElement) : null;
  },
};

function customRender<Q extends Queries = {}>(
  ui: JSX.Element,
  options: Omit<TestWrapperProps, 'children'> & RenderOptions<Q> = {},
): RenderResult<typeof queries & Q & CustomQueries> {
  const { apolloMocks, stripePublishableKey, queries: providedQueries, ...otherOptions } = options;
  const combinedQueries: typeof queries & Q & CustomQueries = {
    ...queries,
    ...customQueries,
    ...providedQueries,
  } as typeof queries & Q & CustomQueries;
  return render(ui, {
    wrapper: (wrapperProps) => (
      <TestWrapper
        apolloMocks={apolloMocks}
        stripePublishableKey={stripePublishableKey}
        {...wrapperProps}
      />
    ),
    queries: combinedQueries,
    ...otherOptions,
  });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
