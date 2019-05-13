import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import Modal from 'react-bootstrap4-modal';

import BooleanInput from '../BuiltInFormControls/BooleanInput';
import ErrorDisplay from '../ErrorDisplay';
import ModalContainer from '../ModalDialogs/ModalContainer';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import { TransitionEventProposal } from './mutations.gql';

const STATUSES = [
  { key: 'proposed', transitionLabel: 'Update', buttonClass: 'btn-primary' },
  { key: 'reviewing', transitionLabel: 'Update', buttonClass: 'btn-primary' },
  { key: 'accepted', transitionLabel: 'Accept', buttonClass: 'btn-success' },
  {
    key: 'rejected', transitionLabel: 'Reject', buttonClass: 'btn-danger', offerDropEvent: true,
  },
  {
    key: 'withdrawn', transitionLabel: 'Update', buttonClass: 'btn-danger', offerDropEvent: true,
  },
];

function getStatus(key) {
  return STATUSES.find(status => status.key === key);
}

class EventProposalStatusUpdater extends React.Component {
  static propTypes = {
    eventProposal: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string,
      status: PropTypes.string.isRequired,
      event: PropTypes.shape({}).isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      status: props.eventProposal.status,
      mutationInProgress: false,
      dropEvent: false,
      error: null,
    };
  }

  performTransition = async (mutate, closeModal) => {
    this.setState({ mutationInProgress: true });
    try {
      await mutate({
        variables: {
          eventProposalId: this.props.eventProposal.id,
          status: this.state.status,
          dropEvent: this.state.dropEvent,
        },
      });
      this.setState({ mutationInProgress: false });
      closeModal();
    } catch (error) {
      this.setState({ mutationInProgress: false, error });
    }
  }

  render = () => (
    <ModalContainer>
      {({ openModal, closeModal, modalVisible }) => (
        <div>
          Status:
          {' '}
          {this.props.eventProposal.status}
          {' '}
          <button type="button" className="btn btn-sm btn-primary" onClick={openModal}>
            Change
          </button>

          <Modal visible={modalVisible}>
            <div className="modal-header">
              {'Change status for '}
              {this.props.eventProposal.title}
            </div>

            <div className="modal-body">
              <MultipleChoiceInput
                caption="New status"
                choices={['proposed', 'reviewing', 'accepted', 'rejected', 'withdrawn'].map(status => ({
                  label: status, value: status,
                }))}
                value={this.state.status}
                onChange={status => this.setState({ status, dropEvent: false })}
                disabled={this.state.mutationInProgress}
              />

              {
                this.state.status === 'accepted' && !this.props.eventProposal.event
                  ? (
                    <p className="text-danger">
                      This will create an event on the convention web site.  It will not yet be
                      on the schedule or possible to sign up for, but it will appear in the events
                      list.
                    </p>
                  )
                  : null
              }

              {
                getStatus(this.state.status).offerDropEvent && this.props.eventProposal.event
                  ? (
                    <BooleanInput
                      caption="Drop event?"
                      value={this.state.dropEvent}
                      onChange={dropEvent => this.setState({ dropEvent })}
                      disabled={this.state.mutationInProgress}
                    />
                  )
                  : null
              }

              <ErrorDisplay graphQLError={this.state.error} />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
                disabled={this.state.mutationInProgress}
              >
                Cancel
              </button>

              <Mutation mutation={TransitionEventProposal}>
                {mutate => (
                  <button
                    type="button"
                    className={`btn ${getStatus(this.state.status).buttonClass}`}
                    onClick={() => this.performTransition(mutate, closeModal)}
                    disabled={
                      this.state.mutationInProgress
                      || this.state.status === this.props.eventProposal.status
                    }
                  >
                    {getStatus(this.state.status).transitionLabel}
                  </button>
                )}
              </Mutation>
            </div>
          </Modal>
        </div>
      )}
    </ModalContainer>
  )
}

export default EventProposalStatusUpdater;
