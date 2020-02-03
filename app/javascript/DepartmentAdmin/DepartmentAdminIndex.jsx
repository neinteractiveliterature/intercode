import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import { DepartmentAdminQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import { sortByLocaleString } from '../ValueUtils';

function DepartmentAdminIndex() {
  const { data, loading, error } = useQuery(DepartmentAdminQuery);

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
