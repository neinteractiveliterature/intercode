import { ActionFunction, Form, redirect, useLoaderData, useNavigation } from 'react-router';

import usePageTitle from '../usePageTitle';
import { buildDepartmentInputFromFormData } from './buildDepartmentInput';
import DepartmentForm from './DepartmentForm';
import { singleDepartmentAdminLoader, SingleDepartmentAdminLoaderResult } from './loaders';
import { client } from '../useIntercodeApolloClient';
import { UpdateDepartmentDocument } from './mutations.generated';
import { DepartmentAdminQueryDocument } from './queries.generated';
import { useTranslation } from 'react-i18next';

export async function action({ params: { id }, request }) {
  try {
    const formData = await request.formData();
    await client.mutate({
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

export const loader = singleDepartmentAdminLoader;

function EditDepartment() {
  const { department: initialDepartment } = useLoaderData() as SingleDepartmentAdminLoaderResult;
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
