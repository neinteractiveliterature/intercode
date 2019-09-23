import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { humanize, pluralize } from 'inflected';

import { useConfirm } from '../ModalDialogs/Confirm';
import { DeleteForm } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { FormAdminQuery } from './queries.gql';
import { sortByLocaleString } from '../ValueUtils';
import useQuerySuspended from '../useQuerySuspended';
import usePageTitle from '../usePageTitle';
import { useDeleteMutation } from '../MutationUtils';

function describeFormUsers(form) {
  return [
    ...form.user_con_profile_conventions.map((convention) => `User profile form for ${convention.name}`).sort(),
    ...form.event_categories.map((eventCategory) => `Event form for ${pluralize(eventCategory.name)}`).sort(),
    ...form.proposal_event_categories.map((eventCategory) => `Proposal form for ${pluralize(eventCategory.name)}`).sort(),
  ];
}

function FormAdminIndex() {
  const { data, error } = useQuerySuspended(FormAdminQuery);
  const confirm = useConfirm();
  const deleteForm = useDeleteMutation(DeleteForm, {
    query: FormAdminQuery,
    arrayPath: ['convention', 'forms'],
    idVariablePath: ['id'],
  });
  const sortedForms = useMemo(
    () => (error
      ? null
      : sortByLocaleString(data.convention.forms, (form) => form.title)),
    [data, error],
  );

  usePageTitle('Forms');

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4">
        {'Forms for '}
        {data.convention.name}
      </h1>

      <div className="alert alert-danger mt-4">
        Form editing is an advanced feature that requires knowledge of Intercode’s
        form system as well as directly editing JSON data.  Proceed with caution.
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Form type</th>
            <th>Usage</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sortedForms.map((form) => (
            <tr key={form.id}>
              <td>{form.title}</td>
              <td>{humanize(form.form_type)}</td>
              <td>
                <ul className="list-unstyled m-0">
                  {describeFormUsers(form).map((formUser, i) => (
                    <li key={i /* eslint-disable-line react/no-array-index-key */}>
                      {formUser}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="text-right">
                <button
                  className="btn btn-sm btn-outline-danger mr-2"
                  type="button"
                  onClick={() => confirm({
                    prompt: 'Are you sure you want to delete this form?',
                    renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                    action: () => deleteForm({ variables: { id: form.id } }),
                  })}
                >
                  <i className="fa fa-trash-o" />
                  <span className="sr-only">
                    Delete form
                  </span>
                </button>
                <Link to={`/admin_forms/${form.id}/edit`} className="btn btn-sm btn-outline-primary">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/admin_forms/new" className="btn btn-primary">
        New form
      </Link>
    </>
  );
}

export default FormAdminIndex;
