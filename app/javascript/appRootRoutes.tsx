import { RouteObject } from 'react-router';
import PageComponents from './PageComponents';
import AppRoot, { AppRootLayoutContent } from './AppRoot';
import { preloadQuery } from './useIntercodeApolloClient';
import { AppRootQueryData, AppRootQueryDocument, AppRootQueryVariables } from './appRootQueries.generated';
import { routes } from './AppRouter';

const appRootRoutes: RouteObject[] = [
  {
    element: <AppRoot />,
    loader: () => preloadQuery<AppRootQueryData, AppRootQueryVariables>(AppRootQueryDocument),
    children: [
      {
        path: '/admin_forms/:id/edit/*',
        element: <PageComponents.FormEditor />,
        children: [
          { path: 'section/:sectionId/item/:itemId', element: <PageComponents.FormItemEditorLayout /> },
          { path: 'section/:sectionId', element: <PageComponents.FormSectionEditorLayout /> },
        ],
      },
      {
        element: <AppRootLayoutContent />,
        children: routes,
      },
    ],
  },
];

export default appRootRoutes;
