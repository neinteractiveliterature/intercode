import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import usePageTitle from '../usePageTitle';
import buildDepartmentInput from './buildDepartmentInput';
import DepartmentForm, { DepartmentFormProps } from './DepartmentForm';
import { AdminDepartmentFieldsFragmentDoc } from './queries.generated';
import { useCreateMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform/dist';
import { useCreateDepartmentMutation } from './mutations.generated';
import { useDepartmentAdminLoader } from './loaders';

function NewDepartment(): JSX.Element {
  const data = useDepartmentAdminLoader();
  const [createDepartment] = useCreateMutationWithReferenceArrayUpdater(
    useCreateDepartmentMutation,
    data.convention,
    'departments',
    (data) => data.createDepartment.department,
    AdminDepartmentFieldsFragmentDoc,
  );
  const navigate = useNavigate();

  usePageTitle('New department');

  const onSave = useCallback(
    async (department: DepartmentFormProps['initialDepartment']) => {
      await createDepartment({
        variables: {
          department: buildDepartmentInput(department),
        },
      });
      navigate('/admin_departments');
    },
    [createDepartment, navigate],
  );

  return (
    <>
      <h1 className="mb-4">New department</h1>

      <DepartmentForm initialDepartment={{ name: '', proposal_description: '' }} onSave={onSave} />
    </>
  );
}

export const Component = NewDepartment;
