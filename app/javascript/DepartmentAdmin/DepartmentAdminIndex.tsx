import { Link } from 'react-router-dom';
import {
  LoadQueryWrapper,
  useGraphQLConfirm,
  sortByLocaleString,
  useDeleteMutationWithReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';

import usePageTitle from '../usePageTitle';
import { useDepartmentAdminQuery } from './queries.generated';
import { useDeleteDepartmentMutation } from './mutations.generated';

export default LoadQueryWrapper(useDepartmentAdminQuery, function DepartmentAdminIndex({ data }) {
  const confirm = useGraphQLConfirm();
  const [deleteDepartment] = useDeleteMutationWithReferenceArrayUpdater(
    useDeleteDepartmentMutation,
    data.convention,
    'departments',
    (department) => ({ id: department.id }),
  );
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
                  className="btn btn-sm btn-outline-danger me-2"
                  onClick={() =>
                    confirm({
                      action: () => deleteDepartment(department),
                      prompt: `Are you sure you want to delete the department “${department.name}”?`,
                    })
                  }
                >
                  <span className="visually-hidden">Delete department</span>
                  <i className="bi-trash" />
                </button>
                <Link to={`/admin_departments/${department.id}/edit`} className="btn btn-sm btn-outline-secondary">
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
