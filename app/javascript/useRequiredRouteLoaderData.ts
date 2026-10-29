import { useRouteLoaderData } from 'react-router';

// useRouteLoaderData returns undefined when the route isn't one of the current matches. Components that read their
// parent route's data are always rendered inside it, so an error here is a mistake in the routes, and this keeps the
// data's type from the loader without a cast.
export default function useRequiredRouteLoaderData<Loader>(routeId: string) {
  const data = useRouteLoaderData<Loader>(routeId);
  if (data === undefined) {
    throw new Error(`There is no loader data for the route ${routeId}: is this component inside it?`);
  }
  return data;
}
