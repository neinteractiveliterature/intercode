import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import Modal, { ConfirmModal } from 'react-bootstrap4-modal';
import moment from 'moment';
import eventsQuery, { fragments } from '../eventsQuery';
import { createRunMutation, updateRunMutation, deleteRunMutation } from '../mutations';
import RunFormFields from '../../BuiltInForms/RunFormFields';

@compose(
  graphql(createRunMutation, { name: 'createRun' }),
  graphql(updateRunMutation, { name: 'updateRun' }),
  graphql(deleteRunMutation, { name: 'deleteRun' }),
)
class EditRunModal extends React.Component {
  static propTypes = {
    run: propType(fragments.runFragment),
    event: propType(fragments.eventFragment),
    convention: propType(fragments.conventionFragment).isRequired,
    editingRunChanged: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSaveStart: PropTypes.func.isRequired,
    onSaveSucceeded: PropTypes.func.isRequired,
    onSaveFailed: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    createRun: PropTypes.func.isRequired,
    deleteRun: PropTypes.func.isRequired,
    updateRun: PropTypes.func.isRequired,
  }

  static defaultProps = {
    run: null,
    event: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      day: null,
      hour: null,
      minute: null,
      isConfirmingDelete: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.run && !nextProps.run) {
      // the run just cleared out; reset the form state
      this.setState({ isConfirmingDelete: false });
    }
  }

  initiateSaveMutation = () => {
    const { run } = this.props;
    const commonProps = {
      starts_at: run.starts_at,
      title_suffix: run.title_suffix,
      schedule_note: run.schedule_note,
      room_ids: run.rooms.map(room => room.id),
    };

    if (run.id) {
      return this.props.updateRun({
        variables: {
          input: {
            id: run.id,
            ...commonProps,
          },
        },
      });
    }

    return this.props.createRun({
      variables: {
        input: {
          event_id: this.props.event.id,
          ...commonProps,
        },
      },
      update: (store, { data: { createRun: { run: newRun } } }) => {
        const eventsData = store.readQuery({ query: eventsQuery });
        const eventData = eventsData.events.find(event => event.id === this.props.event.id);
        eventData.runs.push(newRun);
        store.writeQuery({ query: eventsQuery, data: eventsData });
      },
    });
  }

  saveRun = () => {
    this.props.onSaveStart();

    this.initiateSaveMutation()
      .then(data => this.props.onSaveSucceeded(data.run))
      .catch(error => this.props.onSaveFailed(error));
  }

  deleteClicked = () => {
    this.setState({ isConfirmingDelete: true });
  }

  deleteCanceled = () => {
    this.setState({ isConfirmingDelete: false });
  }

  deleteConfirmed = () => {
    this.props.deleteRun({
      variables: {
        input: {
          id: this.props.run.id,
        },
      },
      update: (store) => {
        const eventsData = store.readQuery({ query: eventsQuery });
        const eventData = eventsData.events.find(event => event.id === this.props.event.id);
        const runIndex = eventData.runs.findIndex(run => run.id === this.props.run.id);
        eventData.runs.splice(runIndex, 1);
        store.writeQuery({ query: eventsQuery, data: eventsData });
      },
    }).then(() => {
      this.setState(
        { isConfirmingDelete: false },
        this.props.onDelete,
      );
    });
  }

  renderTitle = () => {
    const { run, event } = this.props;

    if (!run) {
      return null;
    }

    if (run.id != null) {
      return `Edit run of ${event.title} `;
    }

    return `Add run of ${event.title}`;
  }

  renderFormBody = () => {
    if (!this.props.run) {
      return <div className="modal-body" />;
    }

    return (
      <div className="modal-body">
        <RunFormFields
          run={this.props.run}
          event={this.props.event}
          convention={this.props.convention}
          onChange={this.props.editingRunChanged}
        />
      </div>
    );
  }

  render = () => (
    <div>
      <Modal visible={this.props.run != null && !this.state.isConfirmingDelete}>
        <div className="modal-header">
          <h5 className="modal-title">{this.renderTitle()}</h5>
        </div>
        {this.renderFormBody()}
        <div className="modal-footer">
          <div className="d-flex w-100">
            <div>
              <button type="button" className="btn btn-outline-danger" onClick={this.deleteClicked}>
                Delete
              </button>
            </div>
            <div className="col text-right pr-0">
              <button type="button" className="btn btn-secondary mr-2" onClick={this.props.onCancel}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.saveRun}
                disabled={!this.props.run || this.props.run.starts_at == null}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <ConfirmModal
        visible={this.state.isConfirmingDelete}
        onCancel={this.deleteCanceled}
        onOK={this.deleteConfirmed}
      >
        Are you sure you want to delete this run of {this.props.event && this.props.event.title}?
      </ConfirmModal>
    </div>
  )
}

export default EditRunModal;
