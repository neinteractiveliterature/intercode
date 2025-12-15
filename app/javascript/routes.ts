import { type RouteConfig, layout, route } from '@react-router/dev/routes';

export default [
  layout('./AppRoot.tsx', [layout('./AppRootLayout.tsx', [route('*', './FourOhFourPage.tsx')])]),
] satisfies RouteConfig;
