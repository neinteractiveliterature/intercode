import { useMemo } from 'react';
import { ActionFunction, Link, LoaderFunction, redirect, useLoaderData, useSubmit } from 'react-router';
import { useModal, useConfirm, ErrorDisplay, sortByLocaleString } from '@neinteractiveliterature/litform';

import usePageTitle from '../usePageTitle';
import NewFormModal from './NewFormModal';
import { FormAdminQueryData, FormAdminQueryDocument } from './queries.generated';
import humanize from '../humanize';
import { client } from '../useIntercodeApolloClient';
import { CreateFormDocument } from './mutations.generated';
import { FormType } from '../graphqlTypes.generated';

function describeFormUsers(form: FormAdminQueryData['convention']['forms'][0]) {
  return [
    ...form.user_con_profile_conventions.map((convention) => `User profile form for ${convention.name}`).sort(),
    ...form.event_categories.map((eventCategory) => `Event form for ${eventCategory.name} events`).sort(),
    ...form.proposal_event_categories.map((eventCategory) => `Proposal form for ${eventCategory.name} events`).sort(),
  ];
}

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<FormAdminQueryData>({ query: FormAdminQueryDocument });
  return data;
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const { data } = await client.mutate({
      mutation: CreateFormDocument,
      variables: {
        form: {
          title: formData.get('title')?.toString(),
        },
        formType: formData.get('form_type')?.toString() as FormType,
      },
    });
    return redirect(`/admin_forms/${data?.createForm.form.id}/edit`);
  } catch (error) {
    return error;
  }
};

function FormAdminIndex() {
  const data = useLoaderData() as FormAdminQueryData;
  const confirm = useConfirm();
  const newFormModal = useModal();
  const sortedForms = useMemo(() => sortByLocaleString(data.convention.forms, (form) => form.title), [data]);
  const submit = useSubmit();

  usePageTitle('Forms');

  return (
    <>
      <h1 className="mb-4">
        {'Forms for '}
        {data.convention.name}
      </h1>

      <div className="alert alert-warning mt-4">Changes to forms take effect immediately. Proceed with caution.</div>

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
                    <li key={i}>{formUser}</li>
                  ))}
                </ul>
              </td>
              <td className="text-end">
                <button
                  className="btn btn-sm btn-outline-danger me-2"
                  type="button"
                  onClick={() =>
                    confirm({
                      prompt: 'Are you sure you want to delete this form?',
                      renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                      action: () => submit({}, { action: `./${form.id}`, method: 'DELETE' }),
                    })
                  }
                >
                  <i className="bi-trash" />
                  <span className="visually-hidden">Delete form</span>
                </button>
                <Link to={`/admin_forms/${form.id}/edit`} className="btn btn-sm btn-outline-primary">
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
}

export default FormAdminIndex;
