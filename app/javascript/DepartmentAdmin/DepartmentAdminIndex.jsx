import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { DepartmentAdminQuery } from './queries.gql';
import { DeleteDepartment } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import { sortByLocaleString } from '../ValueUtils';
import usePageTitle from '../usePageTitle';
import { useConfirm } from '../ModalDialogs/Confirm';
import { useDeleteMutation } from '../MutationUtils';

function DepartmentAdminIndex() {
  const { data, loading, error } = useQuery(DepartmentAdminQuery);
  const confirm = useConfirm();
  const deleteDepartment = useDeleteMutation(DeleteDepartment, {
    query: DepartmentAdminQuery,
    arrayPath: ['convention', 'departments'],
    idVariablePath: ['id'],
  });
  usePageTitle('Departments');

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4">Departments</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Event categories</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.convention.departments.map((department) => (
            <tr key={`${department.id}`}>
              <td>{department.name}</td>
              <td>{sortByLocaleString(department.event_categories.map((category) => category.name), (name) => name).join(', ')}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger mr-2"
                  onClick={() => confirm({
                    action: () => deleteDepartment({ variables: { id: department.id } }),
                    prompt: `Are you sure you want to delete the department “${department.name}”?`,
                    renderError: (err) => <ErrorDisplay graphQLError={err} />,
                  })}
                >
                  <span className="sr-only">Delete department</span>
                  <i className="fa fa-trash-o" />
                </button>
                <Link
                  to={`/admin_departments/${department.id}/edit`}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/admin_departments/new" className="btn btn-primary">
        New department
      </Link>
    </>
  );
}

export default DepartmentAdminIndex;
