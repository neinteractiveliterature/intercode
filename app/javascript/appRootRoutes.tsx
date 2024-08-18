import { RouteObject } from 'react-router';
import AppRoot, { AppRootLayoutContent } from './AppRoot';
import { preloadQuery } from './useIntercodeApolloClient';
import { AppRootQueryData, AppRootQueryDocument, AppRootQueryVariables } from './appRootQueries.generated';
import { NamedRoute, routes } from './AppRouter';
import { liquidDocsLoader } from './LiquidDocs/loader';

const appRootRoutes: RouteObject[] = [
  {
    element: <AppRoot />,
    loader: () => preloadQuery<AppRootQueryData, AppRootQueryVariables>(AppRootQueryDocument),
    children: [
      {
        path: '/admin_forms/:id/edit/*',
        lazy: () => import('./FormAdmin/FormEditor'),
        children: [
          { path: 'section/:sectionId/item/:itemId', lazy: () => import('./FormAdmin/FormItemEditorLayout') },
          { path: 'section/:sectionId', lazy: () => import('./FormAdmin/FormSectionEditorLayout') },
        ],
      },
      {
        path: '/liquid_docs',
        id: NamedRoute.LiquidDocs,
        loader: liquidDocsLoader,
        children: [
          { path: 'assigns/:name', lazy: () => import('./LiquidDocs/AssignDoc') },
          { path: 'filters/:name', lazy: () => import('./LiquidDocs/FilterDoc') },
          { path: 'tags/:name', lazy: () => import('./LiquidDocs/LiquidTagDoc') },
          { index: true, lazy: () => import('./LiquidDocs') },
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
