import { Form, redirect, useActionData, useNavigation } from 'react-router';

import usePageTitle from '../usePageTitle';
import DepartmentForm from './DepartmentForm';
import { apolloClientContext } from '~/AppContexts';
import { CreateDepartmentDocument } from './mutations.generated';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildDepartmentInputFromFormData } from './buildDepartmentInput';
import { DepartmentAdminQueryDocument } from './queries.generated';
import { Route } from './+types/NewDepartment';

export const clientAction = async ({ context, request }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    const formData = await request.formData();
    await client.mutate({
      mutation: CreateDepartmentDocument,
      variables: {
        department: buildDepartmentInputFromFormData(formData),
      },
      refetchQueries: [{ query: DepartmentAdminQueryDocument }],
      awaitRefetchQueries: true,
    });
    return redirect('..');
  } catch (error) {
    return error;
  }
};

function NewDepartment(): React.JSX.Element {
  const { t } = useTranslation();
  const saveError = useActionData();
  const navigation = useNavigation();
  usePageTitle('New department');

  return (
    <>
      <h1 className="mb-4">New department</h1>

      <Form action="." method="POST">
        <DepartmentForm
          initialDepartment={{ name: '', proposal_description: '' }}
          disabled={navigation.state !== 'idle'}
        />

        <ErrorDisplay graphQLError={saveError} />

        <input
          type="submit"
          className="btn btn-primary"
          disabled={navigation.state !== 'idle'}
          value={t('buttons.create')}
          aria-label={t('buttons.create')}
        />
      </Form>
    </>
  );
}

export const Component = NewDepartment;
