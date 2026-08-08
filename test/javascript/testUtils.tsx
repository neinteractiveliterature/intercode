import { Suspense, useMemo, useState } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedProviderProps } from '@apollo/client/testing/react';
import { MockLink } from '@apollo/client/testing';
import { render, queries, Queries, RenderOptions, RenderResult, waitFor } from '@testing-library/react';
import { createMemoryRouter, createRoutesStub, RouterContextProvider, RouterProvider } from 'react-router';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import type { Stripe } from '@stripe/stripe-js';
import { Confirm } from '@neinteractiveliterature/litform';
import type { ApolloCache } from '@apollo/client';

import getI18n from '../../app/javascript/setupI18Next';
import { LazyStripeContext } from '../../app/javascript/LazyStripe';
import AppRootContext, { appRootContextDefaultValue, AppRootContextValue } from '../../app/javascript/AppRootContext';
import { apolloClientContext } from '../../app/javascript/AppContexts';

export type TestWrapperProps = {
  apolloMocks?: MockedProviderProps['mocks'];
  apolloCache?: ApolloCache;
  children?: React.ReactNode;
  stripePublishableKey?: string;
  i18nInstance: i18n;
  appRootContextValue?: Partial<AppRootContextValue>;
};

function TestWrapper({
  apolloMocks,
  apolloCache,
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
      future: {},
    },
  );

  return (
    <AppRootContext.Provider value={effectiveAppRootContextValue}>
      <MockedProvider mocks={apolloMocks} cache={apolloCache}>
        <LazyStripeContext.Provider value={lazyStripeProviderValue}>
          <Confirm>
            <I18nextProvider i18n={i18nInstance}>
              <RouterProvider router={router} />
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
  ui: React.JSX.Element,
  options: Omit<TestWrapperProps, 'children' | 'i18nInstance'> & RenderOptions<Q> = {},
): Promise<RenderResult<typeof queries & Q & CustomQueries>> {
  const {
    apolloMocks,
    apolloCache,
    stripePublishableKey,
    queries: providedQueries,
    appRootContextValue,
    ...otherOptions
  } = options;
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
        apolloCache={apolloCache}
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

export type RenderRouteOptions = {
  apolloMocks?: MockLink.MockedResponse[];
  initialEntries?: string[];
  initialIndex?: number;
  appRootContextValue?: Partial<AppRootContextValue>;
};

type RouteStubArray = Parameters<typeof createRoutesStub>[0];

// Fills in a no-op HydrateFallback on every route that doesn't already have one, recursively --
// otherwise react-router logs a "No HydrateFallback element provided" warning while a route's
// loader is still resolving, which is expected and harmless in every one of these tests (they all
// await the real content afterward).
function withDefaultHydrateFallback(routes: RouteStubArray): RouteStubArray {
  return routes.map((route) => ({
    HydrateFallback: () => null,
    ...route,
    children: route.children ? withDefaultHydrateFallback(route.children) : route.children,
  })) as RouteStubArray;
}

// For components that get their data via a React Router loader/action (context.get(apolloClientContext)
// inside a LoaderFunction/ActionFunction) rather than an Apollo hook -- MockedProvider only intercepts
// hooks that go through React's ApolloProvider context, so a loader-side client.query() call needs its
// own real ApolloClient wired to a MockLink instead. Mirrors how the real app wires up its router
// context (see packs/application.tsx's getContext), and matches its v8_middleware future flag so
// context.get/set behaves the same way in tests as it does in production.
export async function renderRoute(
  routes: RouteStubArray,
  options: RenderRouteOptions = {},
): Promise<RenderResult<typeof queries & CustomQueries>> {
  const { apolloMocks = [], initialEntries, initialIndex, appRootContextValue } = options;

  const client = new ApolloClient({ link: new MockLink(apolloMocks), cache: new InMemoryCache() });
  const context = new RouterContextProvider();
  context.set(apolloClientContext, client);

  const RoutesStub = createRoutesStub(withDefaultHydrateFallback(routes), context);
  const i18nInstance = await getI18n();
  const effectiveAppRootContextValue = { ...appRootContextDefaultValue, ...appRootContextValue };

  const result = render(
    <AppRootContext.Provider value={effectiveAppRootContextValue}>
      <Confirm>
        <I18nextProvider i18n={i18nInstance}>
          <RoutesStub initialEntries={initialEntries} initialIndex={initialIndex} future={{ v8_middleware: true }} />
        </I18nextProvider>
      </Confirm>
    </AppRootContext.Provider>,
    { queries: { ...queries, ...customQueries } },
  );

  return result as RenderResult<typeof queries & CustomQueries>;
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
