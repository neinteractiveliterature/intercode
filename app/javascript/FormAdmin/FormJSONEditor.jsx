import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import CodeInput from '../BuiltInFormControls/CodeInput';
import { CreateFormWithJSON, UpdateFormWithJSON } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { FormAdminQuery } from './queries.gql';
import { mutator, Transforms } from '../ComposableFormUtils';

function formDataFromJSON(json) {
  const { title, sections } = JSON.parse(json);
  return {
    title,
    sectionsJSON: JSON.stringify(sections, null, '  '),
  };
}

class FormJSONEditor extends React.Component {
  static propTypes = {
    initialForm: PropTypes.shape({
      id: PropTypes.number,
      export_json: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      form: formDataFromJSON(this.props.initialForm.export_json),
    };

    this.mutator = mutator({
      component: this,
      transforms: {
        form: {
          title: Transforms.identity,
          sectionsJSON: Transforms.identity,
        },
      },
    });
  }

  save = async (createForm, updateForm) => {
    const formJSON = JSON.stringify({
      title: this.state.form.title,
      sections: JSON.parse(this.state.form.sectionsJSON),
    });

    this.setState({ error: null, operationInProgress: true });
    try {
      if (this.props.initialForm.id) {
        await updateForm({
          variables: {
            id: this.props.initialForm.id,
            formJSON,
          },
        });
      } else {
        await createForm({
          variables: { formJSON },
          update: (store, { data: { createFormWithJSON: { form } } }) => {
            const data = store.readQuery({ query: FormAdminQuery });
            store.writeQuery({
              query: FormAdminQuery,
              data: {
                ...data,
                convention: {
                  ...data.convention,
                  forms: [
                    ...data.convention.forms,
                    form,
                  ],
                },
              },
            });
          },
        });
      }
      this.props.history.push('/');
    } catch (error) {
      this.setState({ error, operationInProgress: false });
    }
  }

  render = () => (
    <div>
      <h1 className="mb-4">
        {
          this.props.initialForm.id
            ? `Editing ${this.state.form.title}`
            : 'New form'
        }
      </h1>

      <BootstrapFormInput
        label="Title"
        name="title"
        value={this.state.form.title}
        onChangeText={this.mutator.form.title}
      />

      <fieldset className="mb-4">
        <legend className="col-form-label">Content</legend>
        <CodeInput
          value={this.state.form.sectionsJSON}
          mode="application/json"
          onChange={this.mutator.form.sectionsJSON}
        />
      </fieldset>

      <div className="mb-4">
        <Mutation mutation={CreateFormWithJSON}>
          {createForm => (
            <Mutation mutation={UpdateFormWithJSON}>
              {updateForm => (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.save(createForm, updateForm)}
                  disabled={this.state.operationInProgress}
                >
                  Save changes
                </button>
              )}
            </Mutation>
          )}
        </Mutation>
      </div>

      <ErrorDisplay graphQLError={this.state.error} />
    </div>
  )
}

export default withRouter(FormJSONEditor);
