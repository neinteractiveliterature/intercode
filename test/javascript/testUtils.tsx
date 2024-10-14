import { Suspense, useMemo, useState } from 'react';
import { MockedProvider, MockedProviderProps } from '@apollo/client/testing';
import { render, queries, Queries, RenderOptions, RenderResult, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import type { Stripe } from '@stripe/stripe-js';
import { Confirm } from '@neinteractiveliterature/litform';

import getI18n from '../../app/javascript/setupI18Next';
import { LazyStripeContext } from '../../app/javascript/LazyStripe';
import AppRootContext, { appRootContextDefaultValue, AppRootContextValue } from '../../app/javascript/AppRootContext';

export type TestWrapperProps = {
  apolloMocks?: MockedProviderProps['mocks'];
  apolloResolvers?: MockedProviderProps['resolvers'];
  children?: React.ReactNode;
  stripePublishableKey?: string;
  i18nInstance: i18n;
  appRootContextValue?: Partial<AppRootContextValue>;
};

function TestWrapper({
  apolloMocks,
  apolloResolvers,
  stripePublishableKey,
  i18nInstance,
  appRootContextValue,
  children,
}: TestWrapperProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const lazyStripeProviderValue = useMemo(
    () => ({ publishableKey: stripePublishableKey, stripePromise, setStripePromise }),
    [stripePublishableKey, stripePromise, setStripePromise],
  );
  const effectiveAppRootContextValue = useMemo(
    () => ({ ...appRootContextDefaultValue, ...appRootContextValue }),
    [appRootContextValue],
  );
  const router = createMemoryRouter(
    [
      {
        path: '*',
        Component: () => (
          <Suspense fallback={<div data-testid="test-wrapper-suspense-fallback" />}>{children}</Suspense>
        ),
      },
    ],
    {
      future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
      },
    },
  );

  return (
    <AppRootContext.Provider value={effectiveAppRootContextValue}>
      <MockedProvider mocks={apolloMocks} resolvers={apolloResolvers}>
        <LazyStripeContext.Provider value={lazyStripeProviderValue}>
          <Confirm>
            <I18nextProvider i18n={i18nInstance}>
              <RouterProvider router={router} future={{ v7_startTransition: true }} />
            </I18nextProvider>
          </Confirm>
        </LazyStripeContext.Provider>
      </MockedProvider>
    </AppRootContext.Provider>
  );
}

export type CustomQueries = {
  getMultipleChoiceInput: (container: HTMLElement, formGroupLegendText: string, labelText: string) => HTMLInputElement;
};

const customQueries: CustomQueries = {
  getMultipleChoiceInput: (container: HTMLElement, formGroupLegendText: string, labelText: string) => {
    const formGroup = queries
      .getByText(container, formGroupLegendText, { selector: 'legend' })
      .closest<HTMLElement>('.mb-3');
    if (!formGroup) {
      throw new Error(`Legend with text ${formGroupLegendText} found, but it's not part of a .mb-3 element`);
    }

    const foundElement = queries.getByLabelText(formGroup, labelText);
    if (!(foundElement instanceof HTMLInputElement)) {
      throw new Error(
        `Element with label ${labelText} found in group, but it's not an input (it's a ${foundElement.tagName})`,
      );
    }
    return foundElement;
  },
};

async function customRender<Q extends Queries = Queries>(
  ui: JSX.Element,
  options: Omit<TestWrapperProps, 'children' | 'i18nInstance'> & RenderOptions<Q> = {},
): Promise<RenderResult<typeof queries & Q & CustomQueries>> {
  const { apolloMocks, stripePublishableKey, queries: providedQueries, appRootContextValue, ...otherOptions } = options;
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
        appRootContextValue={appRootContextValue}
        {...wrapperProps}
      />
    ),
    queries: combinedQueries,
    ...otherOptions,
  });
  await waitFor(() => expect(result.queryAllByTestId('test-wrapper-suspense-fallback')).toHaveLength(0));

  return result;
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
