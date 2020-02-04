import React, { useMemo, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from 'react-apollo-hooks';

import { DepartmentAdminQuery } from './queries.gql';
import { UpdateDepartment } from './mutations.gql';
import usePageTitle from '../usePageTitle';
import LoadingIndicator from '../LoadingIndicator';
import ErrorDisplay from '../ErrorDisplay';
import buildDepartmentInput from './buildDepartmentInput';
import DepartmentForm from './DepartmentForm';

function EditDepartment() {
  const { data, loading, error } = useQuery(DepartmentAdminQuery);
  const [updateDepartment] = useMutation(UpdateDepartment);
  const { id } = useParams();
  const history = useHistory();

  const initialDepartment = useMemo(
    () => ((loading || error)
      ? null
      : data.convention.departments.find((d) => d.id.toString() === id)
    ),
    [loading, error, data, id],
  );
  usePageTitle(`Editing “${(initialDepartment || {}).name}”`);

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

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4">
        Editing
        {' '}
        {initialDepartment.name}
      </h1>

      <DepartmentForm
        initialDepartment={initialDepartment}
        onSave={onSave}
      />
    </>
  );
}

export default EditDepartment;
