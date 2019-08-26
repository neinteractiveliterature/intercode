import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import ErrorDisplay from '../../ErrorDisplay';
import { mutator, Transforms } from '../../ComposableFormUtils';
import { SetCmsVariableMutation } from './queries.gql';
import updateCmsVariable from './updateCmsVariable';

class AddVariableRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mutationInProgress: false,
      error: null,
    };

    this.mutator = mutator({
      getState: () => this.props.variable,
      setState: this.props.onChange,
      transforms: {
        key: Transforms.identity,
        value_json: Transforms.identity,
      },
    });
  }

  handleKeyDown = (event, mutate) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this.save(mutate);
        break;

      default:
    }
  }

  save = async (mutate) => {
    this.setState({ mutationInProgress: true, error: null });
    try {
      await mutate({
        variables: {
          key: this.props.variable.key,
          value_json: this.props.variable.value_json,
        },
        update: updateCmsVariable,
      });

      this.props.onSave(this.props.variable.generatedId);
    } catch (error) {
      this.setState({ mutationInProgress: false, error });
    }
  }

  render = () => (
    <>
      <Mutation mutation={SetCmsVariableMutation}>
        {(mutate) => (
          <tr>
            <td>
              <input
                type="text"
                className="form-control text-monospace"
                value={this.props.variable.key}
                onChange={(event) => { this.mutator.key(event.target.value); }}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control text-monospace"
                value={this.props.variable.value_json}
                onChange={(event) => { this.mutator.value_json(event.target.value); }}
                onKeyDown={(event) => this.handleKeyDown(event, mutate)}
              />
            </td>
            <td>
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => this.props.onCancel(this.props.variable.generatedId)}
                  disabled={this.state.mutationInProgress}
                >
                  <i className="fa fa-times" />
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={
                    this.props.variable.key.trim() === ''
                    || this.props.variable.value_json.trim() === ''
                    || this.state.mutationInProgress
                  }
                  onClick={() => this.save(mutate)}
                >
                  <i className="fa fa-check" />
                </button>
              </div>
            </td>
          </tr>
        )}
      </Mutation>
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
  );
}

AddVariableRow.propTypes = {
  variable: PropTypes.shape({
    generatedId: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    value_json: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddVariableRow;
