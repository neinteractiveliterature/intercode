import { MockLink } from '@apollo/client/testing';
import { isRouteErrorResponse, useLoaderData, useRouteError } from 'react-router';

import { renderRoute } from './testUtils';
import { appRootMiddleware } from '../../app/javascript/appRootMiddleware';
import { appRootDataContext } from '../../app/javascript/AppContexts';
import { AppRootLayoutQueryDocument, AppRootQueryDocument } from '../../app/javascript/appRootQueries.generated';
import { editEventGuard, eventPageGuard, guarded, loginRequiredGuard } from '../../app/javascript/routeGuards';
import { SiteMode } from '../../app/javascript/graphqlTypes.generated';
import { buildAppRootConvention, buildAppRootData } from './fixtures/appRoot';

const appRootMock = (convention = buildAppRootConvention()): MockLink.MockedResponse => ({
  request: { query: AppRootQueryDocument },
  result: { data: buildAppRootData(convention) },
});

function ErrorMessage() {
  const error = useRouteError();
  return <p>{isRouteErrorResponse(error) ? `Status ${error.status}` : (error as Error).message}</p>;
}

describe('appRootMiddleware', () => {
  it("starts a page's loader without waiting for the app root data", async () => {
    const events: string[] = [];

    const { findByText } = await renderRoute(
      [
        {
          path: '/page',
          middleware: [appRootMiddleware],
          loader: async ({ context }) => {
            events.push('loader started');
            await context.get(appRootDataContext);
            return null;
          },
          Component: () => <h1>The page</h1>,
        },
      ],
      {
        apolloMocks: [
          {
            request: { query: AppRootQueryDocument },
            delay: 50,
            result: () => {
              events.push('app root data answered');
              return { data: buildAppRootData() };
            },
          },
        ],
        initialEntries: ['/page'],
      },
    );
    await findByText('The page');

    expect(events).toEqual(['loader started', 'app root data answered']);
  });

  it('requests the layout without waiting for the app root data, even if other middleware does', async () => {
    const answered: string[] = [];

    const { findByText } = await renderRoute(
      [
        {
          path: '/page',
          middleware: [
            appRootMiddleware,
            async ({ context }) => {
              await context.get(appRootDataContext);
            },
          ],
          Component: () => <h1>The page</h1>,
        },
      ],
      {
        apolloMocks: [
          {
            request: { query: AppRootQueryDocument },
            delay: 50,
            result: () => {
              answered.push('app root');
              return { data: buildAppRootData() };
            },
          },
          {
            request: { query: AppRootLayoutQueryDocument, variables: { path: '/non_cms_path' } },
            delay: 10,
            result: () => {
              answered.push('layout');
              return {
                data: {
                  __typename: 'Query',
                  cmsParentByRequestHost: {
                    __typename: 'Convention',
                    id: '1',
                    effectiveCmsLayout: { __typename: 'CmsLayout', id: '1', content_html: '<main></main>' },
                  },
                },
              };
            },
          },
        ],
        initialEntries: ['/page'],
      },
    );
    await findByText('The page');

    expect(answered).toEqual(['layout', 'app root']);
  });

  it('makes the app root data available to loaders that await it', async () => {
    function Page() {
      return <h1>{useLoaderData<string>()}</h1>;
    }

    const { findByText } = await renderRoute(
      [
        {
          path: '/page',
          middleware: [appRootMiddleware],
          loader: async ({ context }) => (await context.get(appRootDataContext))?.convention?.name,
          Component: Page,
        },
      ],
      { apolloMocks: [appRootMock()], initialEntries: ['/page'] },
    );

    expect(await findByText('Test Con')).toBeInTheDocument();
  });

  it('shows a failure to load the app root data as the error of what awaited it', async () => {
    const { findByText } = await renderRoute(
      [
        {
          path: '/page',
          middleware: [appRootMiddleware],
          loader: guarded([loginRequiredGuard]),
          Component: () => <h1>The page</h1>,
          ErrorBoundary: ErrorMessage,
        },
      ],
      {
        apolloMocks: [{ request: { query: AppRootQueryDocument }, error: new Error('Server is down') }],
        initialEntries: ['/page'],
      },
    );

    expect(await findByText('Server is down')).toBeInTheDocument();
  });
});

describe('route guards', () => {
  const render = (guards: Parameters<typeof guarded>[0], siteMode: SiteMode) =>
    renderRoute(
      [
        {
          path: '/',
          middleware: [appRootMiddleware],
          children: [
            { index: true, Component: () => <h1>Home page</h1> },
            { path: 'admin_events', Component: () => <h1>Event admin</h1> },
            {
              path: 'guarded',
              loader: guarded(guards),
              Component: () => <h1>Guarded page</h1>,
              ErrorBoundary: ErrorMessage,
            },
          ],
        },
      ],
      {
        apolloMocks: [appRootMock(buildAppRootConvention({ site_mode: siteMode }))],
        initialEntries: ['/guarded'],
      },
    );

  it('rejects an anonymous user once the app root data has loaded', async () => {
    const { findByText } = await render([loginRequiredGuard], SiteMode.Convention);
    expect(await findByText('Status 401')).toBeInTheDocument();
  });

  it('redirects away from the event page of a single event site', async () => {
    const { findByText } = await render([eventPageGuard], SiteMode.SingleEvent);
    expect(await findByText('Home page')).toBeInTheDocument();
  });

  it('shows the event page of other sites', async () => {
    const { findByText } = await render([eventPageGuard], SiteMode.Convention);
    expect(await findByText('Guarded page')).toBeInTheDocument();
  });

  it('redirects to event admin before asking for a login on a single event site', async () => {
    const { findByText } = await render([editEventGuard, loginRequiredGuard], SiteMode.SingleEvent);
    expect(await findByText('Event admin')).toBeInTheDocument();
  });
});
