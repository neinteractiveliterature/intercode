import { type RouteConfig, route } from '@react-router/dev/routes';
import generatedRoutes from './generatedRoutes';

// The app's routes are generated from AppRouter.tsx (see script/genRoutes.mts) until the cutover to framework mode.
export default [route('framework-check', 'routes/framework-check.tsx'), ...generatedRoutes] satisfies RouteConfig;
