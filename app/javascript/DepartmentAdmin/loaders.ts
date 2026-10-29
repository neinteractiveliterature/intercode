import { LoaderFunctionArgs } from 'react-router';
import useRequiredRouteLoaderData from '../useRequiredRouteLoaderData';
import { apolloClientContext } from 'AppContexts';
import { DepartmentAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../NamedRoute';

export const departmentAdminLoader = async ({ context }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: DepartmentAdminQueryDocument, errorPolicy: 'none' });
  return data;
};

export function useDepartmentAdminLoader() {
  return useRequiredRouteLoaderData<typeof departmentAdminLoader>(NamedRoute.DepartmentAdmin);
}

export const singleDepartmentAdminLoader = async ({ params: { id }, ...args }: LoaderFunctionArgs) => {
  const data = await departmentAdminLoader({ params: {}, ...args });
  const department = data.convention.departments.find((department) => department.id === id);

  if (!department) {
    throw new Response(null, { status: 404 });
  }

  return { department, data };
};
