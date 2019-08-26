import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import Confirm from '../../ModalDialogs/Confirm';
import CommitableInput from '../../BuiltInFormControls/CommitableInput';
import ErrorDisplay from '../../ErrorDisplay';
import { CmsVariablesQuery, DeleteCmsVariableMutation, SetCmsVariableMutation } from './queries.gql';

class ExistingVariableRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  render = () => (
    <>
      <tr>
        <td>
          <code>{this.props.variable.key}</code>
        </td>
        <td>
          <Mutation mutation={SetCmsVariableMutation}>
            {(mutate) => (
              <CommitableInput
                className="text-monospace"
                value={this.props.variable.value_json}
                onChange={async (value) => {
                  this.setState({ error: null });
                  try {
                    await mutate({
                      variables: {
                        key: this.props.variable.key,
                        value_json: value,
                      },
                    });
                  } catch (error) {
                    this.setState({ error });
                    throw error;
                  }
                }}
                onCancel={() => this.setState({ error: null })}
              />
            )}
          </Mutation>
        </td>
        <td>
          <Mutation mutation={DeleteCmsVariableMutation}>
            {(mutate) => (
              <Confirm.Trigger>
                {(confirm) => (
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={() => confirm({
                      prompt: `Are you sure you want to delete the variable "${this.props.variable.key}"?`,
                      action: async () => {
                        try {
                          await mutate({
                            variables: { key: this.props.variable.key },
                            update: (cache) => {
                              const data = cache.readQuery({ query: CmsVariablesQuery });
                              cache.writeQuery({
                                query: CmsVariablesQuery,
                                data: {
                                  ...data,
                                  cmsVariables: data.cmsVariables
                                    .filter((variable) => variable.key !== this.props.variable.key),
                                },
                              });
                            },
                          });
                        } catch (error) {
                          this.setState({ error });
                        }
                      },
                    })}
                  >
                    <i className="fa fa-trash-o" />
                    <span className="sr-only">
                      Delete variable &quot;
                      {this.props.variable.key}
                      &quot;
                    </span>
                  </button>
                )}
              </Confirm.Trigger>
            )}
          </Mutation>
        </td>
      </tr>
      {
        this.state.error
          ? (
            <tr>
              <td colSpan="3">
                <ErrorDisplay graphQLError={this.state.error} />
              </td>
            </tr>
          )
          : null
      }
    </>
  )
}

ExistingVariableRow.propTypes = {
  variable: PropTypes.shape({
    key: PropTypes.string.isRequired,
    value_json: PropTypes.string.isRequired,
  }).isRequired,
};

export default ExistingVariableRow;
