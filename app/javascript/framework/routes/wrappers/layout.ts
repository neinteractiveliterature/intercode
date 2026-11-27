import { appRootMiddleware } from '../../../appRootMiddleware';
export { ErrorBoundary, clientLoader, default } from '../../../AppRoot';
export const clientMiddleware = [appRootMiddleware];
