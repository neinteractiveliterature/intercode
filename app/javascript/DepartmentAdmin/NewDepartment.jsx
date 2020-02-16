import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { DepartmentAdminQuery } from './queries.gql';
import { CreateDepartment } from './mutations.gql';
import usePageTitle from '../usePageTitle';
import buildDepartmentInput from './buildDepartmentInput';
import DepartmentForm from './DepartmentForm';
import { useCreateMutation } from '../MutationUtils';

function NewDepartment() {
  const createDepartment = useCreateMutation(CreateDepartment, {
    query: DepartmentAdminQuery,
    arrayPath: ['convention', 'departments'],
    newObjectPath: ['createDepartment', 'department'],
  });
  const history = useHistory();

  usePageTitle('New department');

  const onSave = useCallback(
    async (department) => {
      await createDepartment({
        variables: {
          department: buildDepartmentInput(department),
        },
      });
      history.push('/admin_departments');
    },
    [createDepartment, history],
  );

  return (
    <>
      <h1 className="mb-4">
        New department
      </h1>

      <DepartmentForm
        initialDepartment={{ name: '', proposal_description: '' }}
        onSave={onSave}
      />
    </>
  );
}

export default NewDepartment;
