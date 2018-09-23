import React from 'react';
import PropTypes from 'prop-types';

import { combineStateChangeCalculators, componentLocalStateUpdater, Transforms } from '../ComposableFormUtils';
import ErrorDisplay from '../ErrorDisplay';
import PlainTextDisplay from '../PlainTextDisplay';

class AdminNotes extends React.Component {
  static propTypes = {
    mutate: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      editingValue: null,
      error: null,
      mutationInProgress: false,
    };

    this.stateUpdater = componentLocalStateUpdater(this, combineStateChangeCalculators({
      editingValue: Transforms.inputChange(Transforms.identity),
    }));
  }

  startEditing = () => {
    this.setState(
      { editingValue: this.props.value || '' },
      () => {
        if (this.textareaElement) {
          this.textareaElement.focus();
        }
      },
    );
  }

  cancelEditing = () => { this.setState({ editingValue: null }); }

  save = async () => {
    this.setState({ mutationInProgress: true, error: null });
    try {
      await this.props.mutate(this.state.editingValue);
      this.setState({ mutationInProgress: false, editingValue: null });
    } catch (error) {
      this.setState({ mutationInProgress: false, error });
    }
  }

  render = () => (
    <div className="card bg-warning-light w-100" style={{ maxWidth: '40em' }}>
      <div className="card-body">
        <h5 className="card-title">Admin notes</h5>
        {(
          this.state.editingValue == null
            ? (
              <React.Fragment>
                <PlainTextDisplay value={this.props.value} />
              </React.Fragment>
            )
            : (
              <textarea
                className="form-control"
                value={this.state.editingValue}
                onChange={this.stateUpdater.editingValue}
                ref={(element) => { this.textareaElement = element; }}
              />
            )
        )}
        <ErrorDisplay graphQLError={this.state.error} />
      </div>
      <div className="card-footer text-right">
        {(
          this.state.editingValue == null
            ? (
              <button
                className="btn btn-secondary btn-sm"
                type="button"
                onClick={this.startEditing}
              >
                Edit
              </button>
            )
            : (
              <React.Fragment>
                <button
                  className="btn btn-secondary btn-sm"
                  type="button"
                  onClick={this.cancelEditing}
                  disabled={this.state.mutationInProgress}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm ml-2"
                  type="button"
                  onClick={this.save}
                  disabled={this.state.mutationInProgress}
                >
                  Save
                </button>
              </React.Fragment>
            )
        )}
      </div>
    </div>
  )
}

export default AdminNotes;
