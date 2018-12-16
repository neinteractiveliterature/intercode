import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { flowRight } from 'lodash';
import gql from 'graphql-tag';

import { mutator, Transforms } from '../ComposableFormUtils';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import CodeInput from '../BuiltInFormControls/CodeInput';
import ErrorDisplay from '../ErrorDisplay';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';

const formQuery = gql`
query FormJSONEditorFormQuery($formId: Int!) {
  form(id: $formId) {
    id
    export_json
  }
}
`;

const updateFormMutation = gql`
mutation UpdateFormWithJSON($input: UpdateFormWithJSONInput!) {
  updateFormWithJSON(input: $input) {
    form {
      id
      export_json
    }
  }
}
`;

function formDataFromJSON(json) {
  const { title, sections } = JSON.parse(json);
  return {
    title,
    sectionsJSON: JSON.stringify(sections, null, '  '),
  };
}

@flowRight([
  graphql(formQuery),
  graphql(updateFormMutation, {
    props({ mutate }) {
      return {
        updateForm({ id, formJSON }) {
          return mutate({
            variables: {
              input: {
                id,
                form_json: formJSON,
              },
            },
          });
        },
      };
    },
  }),
])
@GraphQLQueryResultWrapper
class FormJSONEditor extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(formQuery).isRequired,
    formId: PropTypes.number.isRequired,
    updateForm: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      form: formDataFromJSON(this.props.data.form.export_json),
    };

    this.mutator = mutator({
      component: this,
      transforms: {
        form: {
          title: Transforms.textInputChange,
          sectionsJSON: Transforms.identity,
        },
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const nextFormData = formDataFromJSON(nextProps.data.form.export_json);

    this.setState({
      form: nextFormData,
    });
  }

  save = () => {
    this.setState(
      { operationInProgress: true },
      async () => {
        try {
          await this.props.updateForm({
            id: this.props.formId,
            formJSON: JSON.stringify({
              title: this.state.form.title,
              sections: JSON.parse(this.state.form.sectionsJSON),
            }),
          });
          this.setState({ error: null, operationInProgress: false });
        } catch (error) {
          this.setState({ error, operationInProgress: false });
        }
      },
    );
  }

  render = () => (
    <div>
      <h1 className="mb-4">
        Editing
        {' '}
        {this.state.form.title}
      </h1>

      <BootstrapFormInput
        label="Title"
        name="title"
        value={this.state.form.title}
        onChange={this.mutator.form.title}
      />

      <fieldset className="mb-4">
        <legend className="col-form-label">Content</legend>
        <CodeInput
          value={this.state.form.sectionsJSON}
          mode="application/json"
          onBeforeChange={this.mutator.form.sectionsJSON}
        />
      </fieldset>

      <div className="mb-4">
        <button
          className="btn btn-primary"
          onClick={this.save}
          disabled={this.state.operationInProgress}
        >
          Save changes
        </button>
      </div>

      <ErrorDisplay graphQLError={this.state.error} />
    </div>
  )
}

export default FormJSONEditor;
