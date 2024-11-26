import { LoaderFunction, useRouteLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { DepartmentAdminQueryData, DepartmentAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../routes';

export const departmentAdminLoader: LoaderFunction = async () => {
  const { data } = await client.query<DepartmentAdminQueryData>({ query: DepartmentAdminQueryDocument });
  return data;
};

export function useDepartmentAdminLoader() {
  return useRouteLoaderData(NamedRoute.DepartmentAdmin) as DepartmentAdminQueryData;
}

export type SingleDepartmentAdminLoaderResult = {
  data: DepartmentAdminQueryData;
  department: DepartmentAdminQueryData['convention']['departments'][number];
};

export const singleDepartmentAdminLoader: LoaderFunction = async ({ params: { id }, ...args }) => {
  const data = (await departmentAdminLoader({ params: {}, ...args })) as DepartmentAdminQueryData;
  const department = data.convention.departments.find((department) => department.id === id);

  if (!department) {
    throw new Response(null, { status: 404 });
  }

  return { department, data };
};
