import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { humanize, pluralize } from 'inflected';

import { useConfirm } from '../ModalDialogs/Confirm';
import { DeleteForm } from './mutations';
import ErrorDisplay from '../ErrorDisplay';
import { FormAdminQuery } from './queries';
import { sortByLocaleString } from '../ValueUtils';
import usePageTitle from '../usePageTitle';
import { useDeleteMutation } from '../MutationUtils';
import useModal from '../ModalDialogs/useModal';
import NewFormModal from './NewFormModal';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';
import { FormAdminQueryData, useFormAdminQuery } from './queries.generated';

function describeFormUsers(form: FormAdminQueryData['convention']['forms'][0]) {
  return [
    ...form.user_con_profile_conventions
      .map((convention) => `User profile form for ${convention.name}`)
      .sort(),
    ...form.event_categories
      .map((eventCategory) => `Event form for ${pluralize(eventCategory.name)}`)
      .sort(),
    ...form.proposal_event_categories
      .map((eventCategory) => `Proposal form for ${pluralize(eventCategory.name)}`)
      .sort(),
  ];
}

export default LoadQueryWrapper(useFormAdminQuery, function FormAdminIndex({ data }) {
  const confirm = useConfirm();
  const deleteForm = useDeleteMutation(DeleteForm, {
    query: FormAdminQuery,
    arrayPath: ['convention', 'forms'],
    idVariablePath: ['id'],
  });
  const newFormModal = useModal();
  const sortedForms = useMemo(
    () => sortByLocaleString(data.convention.forms, (form) => form.title),
    [data],
  );

  usePageTitle('Forms');

  return (
    <>
      <h1 className="mb-4">
        {'Forms for '}
        {data.convention.name}
      </h1>

      <div className="alert alert-warning mt-4">
        Changes to forms take effect immediately. Proceed with caution.
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
                    <li key={i /* eslint-disable-line react/no-array-index-key */}>{formUser}</li>
                  ))}
                </ul>
              </td>
              <td className="text-right">
                <button
                  className="btn btn-sm btn-outline-danger mr-2"
                  type="button"
                  onClick={() =>
                    confirm({
                      prompt: 'Are you sure you want to delete this form?',
                      renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                      action: () => deleteForm({ variables: { id: form.id } }),
                    })
                  }
                >
                  <i className="fa fa-trash-o" />
                  <span className="sr-only">Delete form</span>
                </button>
                <Link
                  to={`/admin_forms/${form.id}/edit`}
                  className="btn btn-sm btn-outline-primary"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" className="btn btn-primary" onClick={newFormModal.open}>
        New form
      </button>

      <NewFormModal visible={newFormModal.visible} close={newFormModal.close} />
    </>
  );
});
