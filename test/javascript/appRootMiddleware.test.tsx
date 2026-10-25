import { MockLink } from '@apollo/client/testing';

import { renderRoute } from './testUtils';
import { appRootMiddleware } from '../../app/javascript/appRootMiddleware';
import {
  AppRootLayoutQueryData,
  AppRootLayoutQueryDocument,
  AppRootQueryDocument,
} from '../../app/javascript/appRootQueries.generated';
import { buildAppRootData } from './fixtures/appRoot';

const layoutData: AppRootLayoutQueryData = {
  __typename: 'Query',
  cmsParentByRequestHost: {
    __typename: 'Convention',
    id: '1',
    effectiveCmsLayout: { __typename: 'CmsLayout', id: '1', content_html: '<main></main>' },
  },
};

describe('appRootMiddleware', () => {
  it('requests the layout while the app root data is still loading', async () => {
    const answeredAt: Record<string, number> = {};
    const apolloMocks: MockLink.MockedResponse[] = [
      {
        request: { query: AppRootQueryDocument },
        // slow enough that a layout request which waited for this one would clearly finish after it
        delay: 200,
        result: () => {
          answeredAt.appRoot = performance.now();
          return { data: buildAppRootData() };
        },
      },
      {
        request: { query: AppRootLayoutQueryDocument, variables: { path: '/non_cms_path' } },
        delay: 10,
        result: () => {
          answeredAt.layout = performance.now();
          return { data: layoutData };
        },
      },
    ];

    const { findByText } = await renderRoute(
      [{ path: '/events/schedule', middleware: [appRootMiddleware], Component: () => <h1>The schedule</h1> }],
      { apolloMocks, initialEntries: ['/events/schedule'] },
    );
    await findByText('The schedule');

    expect(answeredAt.layout).toBeDefined();
    expect(answeredAt.appRoot).toBeDefined();
    expect(answeredAt.layout).toBeLessThan(answeredAt.appRoot);
  });
});
