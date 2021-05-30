/* eslint-disable import/export */
import { Suspense, useMemo, useState } from 'react';
import { MockedProvider, MockedProviderProps } from '@apollo/client/testing';
import {
  render,
  queries,
  Queries,
  RenderOptions,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import type { Stripe } from '@stripe/stripe-js';

import getI18n from '../../app/javascript/setupI18Next';
import Confirm from '../../app/javascript/ModalDialogs/Confirm';
import { LazyStripeContext } from '../../app/javascript/LazyStripe';

export type TestWrapperProps = {
  apolloMocks?: MockedProviderProps['mocks'];
  children?: React.ReactNode;
  stripePublishableKey?: string;
  i18nInstance: i18n;
};

function TestWrapper({
  apolloMocks,
  stripePublishableKey,
  i18nInstance,
  children,
}: TestWrapperProps) {
  const history = useMemo(() => createMemoryHistory(), []);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const lazyStripeProviderValue = useMemo(
    () => ({ publishableKey: stripePublishableKey, stripePromise, setStripePromise }),
    [stripePublishableKey, stripePromise, setStripePromise],
  );
  return (
    <Router history={history}>
      <MockedProvider mocks={apolloMocks}>
        <LazyStripeContext.Provider value={lazyStripeProviderValue}>
          <Confirm>
            <I18nextProvider i18n={i18nInstance}>
              <Suspense fallback={<div data-testid="test-wrapper-suspense-fallback" />}>
                {children}
              </Suspense>
            </I18nextProvider>
          </Confirm>
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
      .closest<HTMLElement>('.mb-3');
    return formGroup ? (queries.getByLabelText(formGroup, labelText) as HTMLInputElement) : null;
  },
};

async function customRender<Q extends Queries = {}>(
  ui: JSX.Element,
  options: Omit<TestWrapperProps, 'children' | 'i18nInstance'> & RenderOptions<Q> = {},
): Promise<RenderResult<typeof queries & Q & CustomQueries>> {
  const { apolloMocks, stripePublishableKey, queries: providedQueries, ...otherOptions } = options;
  const combinedQueries: typeof queries & Q & CustomQueries = {
    ...queries,
    ...customQueries,
    ...providedQueries,
  } as typeof queries & Q & CustomQueries;
  const i18nInstance = await getI18n();
  const result = render(ui, {
    wrapper: (wrapperProps) => (
      <TestWrapper
        apolloMocks={apolloMocks}
        stripePublishableKey={stripePublishableKey}
        i18nInstance={i18nInstance}
        {...wrapperProps}
      />
    ),
    queries: combinedQueries,
    ...otherOptions,
  });
  await waitFor(() =>
    expect(result.queryAllByTestId('test-wrapper-suspense-fallback')).toHaveLength(0),
  );

  return result;
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
