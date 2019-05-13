import React from 'react';
import { Link } from 'react-router-dom';
import { pluralize } from 'inflected';
import { Mutation } from 'react-apollo';

import Confirm from '../ModalDialogs/Confirm';
import { DeleteForm } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { FormAdminQuery } from './queries.gql';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import { sortByLocaleString } from '../ValueUtils';

function describeFormUsers(form) {
  return [
    ...form.user_con_profile_conventions.map(convention => `User profile form for ${convention.name}`).sort(),
    ...form.event_categories.map(eventCategory => `Event form for ${pluralize(eventCategory.name)}`).sort(),
    ...form.proposal_event_categories.map(eventCategory => `Proposal form for ${pluralize(eventCategory.name)}`).sort(),
  ];
}

function FormAdminIndex() {
  return (
    <QueryWithStateDisplay query={FormAdminQuery}>
      {({ data }) => (
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
                <th>Usage</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sortByLocaleString(data.convention.forms, form => form.title).map(form => (
                <tr key={form.id}>
                  <td>{form.title}</td>
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
                    <Mutation mutation={DeleteForm}>
                      {mutate => (
                        <Confirm.Trigger>
                          {confirm => (
                            <button
                              className="btn btn-sm btn-outline-danger mr-2"
                              type="button"
                              onClick={() => confirm({
                                prompt: 'Are you sure you want to delete this form?',
                                renderError: error => <ErrorDisplay graphQLError={error} />,
                                action: () => mutate({
                                  variables: { id: form.id },
                                  update: (store) => {
                                    const storeData = store.readQuery({ query: FormAdminQuery });
                                    store.writeQuery({
                                      query: FormAdminQuery,
                                      data: {
                                        ...storeData,
                                        convention: {
                                          ...storeData.convention,
                                          forms: storeData.convention.forms
                                            .filter(f => f.id !== form.id),
                                        },
                                      },
                                    });
                                  },
                                }),
                              })}
                            >
                              <i className="fa fa-trash-o" />
                              <span className="sr-only">
                                Delete form
                              </span>
                            </button>
                          )}
                        </Confirm.Trigger>
                      )}
                    </Mutation>
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
      )}
    </QueryWithStateDisplay>
  );
}

export default FormAdminIndex;
