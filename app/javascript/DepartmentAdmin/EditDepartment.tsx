import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import usePageTitle from '../usePageTitle';
import buildDepartmentInput from './buildDepartmentInput';
import DepartmentForm from './DepartmentForm';
import { LoadSingleValueFromCollectionWrapper } from '../GraphqlLoadingWrappers';
import { useDepartmentAdminQuery } from './queries.generated';
import { useUpdateDepartmentMutation } from './mutations.generated';

export default LoadSingleValueFromCollectionWrapper(
  useDepartmentAdminQuery,
  (data, id) => data.convention.departments.find((d) => d.id.toString() === id),
  function EditDepartment({ value: initialDepartment }) {
    const [updateDepartment] = useUpdateDepartmentMutation();
    const history = useHistory();

    usePageTitle(`Editing “${initialDepartment?.name}”`);

    const onSave = useCallback(
      async (department) => {
        await updateDepartment({
          variables: {
            id: initialDepartment.id,
            department: buildDepartmentInput(department),
          },
        });
        history.push('/admin_departments');
      },
      [history, initialDepartment, updateDepartment],
    );

    return (
      <>
        <h1 className="mb-4">Editing {initialDepartment.name}</h1>

        <DepartmentForm initialDepartment={initialDepartment} onSave={onSave} />
      </>
    );
  },
);
