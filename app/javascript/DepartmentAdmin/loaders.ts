import { useRouteLoaderData } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import { DepartmentAdminQueryData, DepartmentAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../AppRouter';
import { Route as RootRoute } from './+types/route';
import { Route as SingleRoute } from './+types/SingleDepartmentRoute';

export const departmentAdminLoader = async ({ context }: RootRoute.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: DepartmentAdminQueryDocument });
  return data;
};

export function useDepartmentAdminLoader() {
  return useRouteLoaderData(NamedRoute.DepartmentAdmin) as DepartmentAdminQueryData;
}

export type SingleDepartmentAdminLoaderResult = {
  data: DepartmentAdminQueryData;
  department: DepartmentAdminQueryData['convention']['departments'][number];
};

export const singleDepartmentAdminLoader = async ({ params: { id }, ...args }: SingleRoute.ClientLoaderArgs) => {
  const data = await departmentAdminLoader({ params: {}, ...args });
  const department = data?.convention.departments.find((department) => department.id === id);

  if (!department) {
    throw new Response(null, { status: 404 });
  }

  return { department, data };
};
