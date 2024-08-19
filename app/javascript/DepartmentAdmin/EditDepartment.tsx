import { useCallback } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import usePageTitle from '../usePageTitle';
import buildDepartmentInput from './buildDepartmentInput';
import DepartmentForm from './DepartmentForm';
import { useUpdateDepartmentMutation } from './mutations.generated';
import { singleDepartmentAdminLoader, SingleDepartmentAdminLoaderResult } from './loaders';

export const loader = singleDepartmentAdminLoader;

function EditDepartment() {
  const { department: initialDepartment } = useLoaderData() as SingleDepartmentAdminLoaderResult;
  const [updateDepartment] = useUpdateDepartmentMutation();
  const navigate = useNavigate();

  usePageTitle(`Editing “${initialDepartment?.name}”`);

  const onSave = useCallback(
    async (department: typeof initialDepartment) => {
      await updateDepartment({
        variables: {
          id: initialDepartment.id,
          department: buildDepartmentInput(department),
        },
      });
      navigate('/admin_departments');
    },
    [navigate, initialDepartment, updateDepartment],
  );

  return (
    <>
      <h1 className="mb-4">Editing {initialDepartment.name}</h1>

      <DepartmentForm initialDepartment={initialDepartment} onSave={onSave} />
    </>
  );
}

export const Component = EditDepartment;
