import React from 'react';
import { Link } from 'react-router-dom';

import { DepartmentAdminQuery } from './queries';
import { DeleteDepartment } from './mutations';

import { sortByLocaleString } from '../ValueUtils';
import usePageTitle from '../usePageTitle';
import { useGraphQLConfirm } from '../ModalDialogs/Confirm';
import { useDeleteMutation } from '../MutationUtils';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';
import { useDepartmentAdminQueryQuery } from './queries.generated';

export default LoadQueryWrapper(useDepartmentAdminQueryQuery, function DepartmentAdminIndex({
  data,
}) {
  const confirm = useGraphQLConfirm();
  const deleteDepartment = useDeleteMutation(DeleteDepartment, {
    query: DepartmentAdminQuery,
    arrayPath: ['convention', 'departments'],
    idVariablePath: ['id'],
  });
  usePageTitle('Departments');

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
              <td>
                {sortByLocaleString(
                  department.event_categories.map((category) => category.name),
                  (name) => name,
                ).join(', ')}
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger mr-2"
                  onClick={() =>
                    confirm({
                      action: () => deleteDepartment({ variables: { id: department.id } }),
                      prompt: `Are you sure you want to delete the department “${department.name}”?`,
                    })
                  }
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
});
