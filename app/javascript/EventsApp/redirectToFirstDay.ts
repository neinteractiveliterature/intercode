import { redirectToFirstDayMiddleware } from './conventionDayUrls';

// The schedule without a day goes to the first day of the convention
export const clientMiddleware = [redirectToFirstDayMiddleware];
