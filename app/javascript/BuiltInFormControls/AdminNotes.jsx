import React from 'react';
import PropTypes from 'prop-types';

import { mutator, Transforms } from '../ComposableFormUtils';
import ErrorDisplay from '../ErrorDisplay';
import PlainTextDisplay from '../PlainTextDisplay';

class AdminNotes extends React.Component {
  static propTypes = {
    mutate: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  static defaultProps = {
    value: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      editingValue: null,
      error: null,
      mutationInProgress: false,
    };

    this.mutator = mutator({
      component: this,
      transforms: {
        editingValue: Transforms.identity,
      },
    });
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

  render = () => {
    if (this.state.editingValue == null) {
      return (
        <div className="input-group bg-warning-light border-warning border-1 w-100" style={{ maxWidth: '40em' }}>
          <div className="flex-grow-1 p-1">
            {
              this.props.value
                ? <PlainTextDisplay value={this.props.value} />
                : <small className="text-muted">Admin notes</small>
            }
          </div>
          <div className="input-group-append">
            <button
              className="btn btn-secondary btn-sm"
              type="button"
              onClick={this.startEditing}
            >
              Edit
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="card bg-warning-light w-100" style={{ maxWidth: '40em' }}>
        <div className="card-body">
          <h5 className="card-title">Admin notes</h5>
          <textarea
            className="form-control"
            value={this.state.editingValue}
            onChange={(event) => { this.mutator.editingValue(event.target.value); }}
            ref={(element) => { this.textareaElement = element; }}
          />
          <ErrorDisplay graphQLError={this.state.error} />
        </div>
        <div className="card-footer text-right">
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
        </div>
      </div>
    );
  }
}

export default AdminNotes;
