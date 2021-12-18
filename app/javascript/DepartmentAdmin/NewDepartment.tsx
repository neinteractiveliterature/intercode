import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import usePageTitle from '../usePageTitle';
import buildDepartmentInput from './buildDepartmentInput';
import DepartmentForm from './DepartmentForm';
import { AdminDepartmentFieldsFragmentDoc, useDepartmentAdminQuery } from './queries.generated';
import { LoadQueryWrapper, useCreateMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform/dist';
import { useCreateDepartmentMutation } from './mutations.generated';

export default LoadQueryWrapper(useDepartmentAdminQuery, function NewDepartment({ data }): JSX.Element {
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
    async (department) => {
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
});
