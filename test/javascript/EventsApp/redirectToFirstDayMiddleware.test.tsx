import { vi } from 'vitest';
import { Outlet } from 'react-router';
import { MockLink } from '@apollo/client/testing';

import { renderRoute } from '../testUtils';
import { redirectToFirstDayMiddleware } from '../../../app/javascript/EventsApp/conventionDayUrls';
import { AppRootQueryDocument } from '../../../app/javascript/appRootQueries.generated';
import { buildAppRootData } from '../fixtures/appRoot';

describe('redirectToFirstDayMiddleware', () => {
  const apolloMocks: MockLink.MockedResponse[] = [
    { request: { query: AppRootQueryDocument }, result: { data: buildAppRootData() } },
  ];

  // The layout's loader is the one that matters here: a redirect from a loader has to wait for it to finish
  const buildRoutes = (layoutLoader: () => null) => [
    {
      path: '/',
      loader: layoutLoader,
      Component: Outlet,
      children: [
        {
          path: 'events/schedule',
          index: false,
          children: [{ index: true, middleware: [redirectToFirstDayMiddleware] }],
        },
        { path: 'events/schedule/:day', Component: () => <h1>A day of the schedule</h1> },
      ],
    },
  ];

  it('sends the schedule to its first day without running the other loaders for the abandoned navigation', async () => {
    const layoutLoader = vi.fn(() => null);

    const { findByText } = await renderRoute(buildRoutes(layoutLoader), {
      apolloMocks,
      initialEntries: ['/events/schedule'],
    });

    expect(await findByText('A day of the schedule')).toBeTruthy();
    // once, for the navigation that really renders. A redirect from the index route's loader would run it for the
    // first navigation as well.
    expect(layoutLoader).toHaveBeenCalledTimes(1);
  });
});
