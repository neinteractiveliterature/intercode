import { Link, useSubmit } from 'react-router-dom';
import { useGraphQLConfirm, sortByLocaleString } from '@neinteractiveliterature/litform';

import usePageTitle from '../usePageTitle';
import { useDepartmentAdminLoader } from './loaders';
import { useTranslation } from 'react-i18next';

function DepartmentAdminIndex() {
  const data = useDepartmentAdminLoader();
  const confirm = useGraphQLConfirm();
  const { t } = useTranslation();
  const submit = useSubmit();
  usePageTitle(t('navigation.admin.departments'));

  return (
    <>
      <h1 className="mb-4">{t('navigation.admin.departments')}</h1>

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
                      action: () => submit({}, { action: `./${department.id}`, method: 'DELETE' }),
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
}

export const Component = DepartmentAdminIndex;
