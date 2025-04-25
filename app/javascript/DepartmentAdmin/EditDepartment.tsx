import { Form, redirect, useNavigation } from 'react-router';

import usePageTitle from '../usePageTitle';
import { buildDepartmentInputFromFormData } from './buildDepartmentInput';
import DepartmentForm from './DepartmentForm';
import { UpdateDepartmentDocument } from './mutations.generated';
import { DepartmentAdminQueryDocument } from './queries.generated';
import { useTranslation } from 'react-i18next';
import { Route } from './+types/EditDepartment';
import { loader as routeLoader } from './route';
import { apolloClientContext } from 'AppContexts';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    await context.get(apolloClientContext).mutate({
      mutation: UpdateDepartmentDocument,
      variables: {
        id,
        department: buildDepartmentInputFromFormData(formData),
      },
      refetchQueries: [{ query: DepartmentAdminQueryDocument }],
      awaitRefetchQueries: true,
    });
    return redirect('../..');
  } catch (error) {
    return error;
  }
}

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const data = await routeLoader({ context, params, request });
  const department = data.convention.departments.find((department) => department.id === params.id);
  if (department == null) {
    throw new Response('Not Found', { status: 404 });
  }
  return department;
}

function EditDepartment({ loaderData: initialDepartment }: Route.ComponentProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  usePageTitle(`Editing “${initialDepartment?.name}”`);

  return (
    <>
      <h1 className="mb-4">Editing {initialDepartment.name}</h1>

      <Form action="." method="PATCH">
        <DepartmentForm initialDepartment={initialDepartment} disabled={navigation.state !== 'idle'} />

        <input
          type="submit"
          className="btn btn-primary"
          value={t('buttons.save')}
          aria-label={t('buttons.save')}
          disabled={navigation.state !== 'idle'}
        />
      </Form>
    </>
  );
}

export default EditDepartment;
