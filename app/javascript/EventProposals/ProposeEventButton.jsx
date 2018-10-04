import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Modal from 'react-bootstrap4-modal';
import { enableUniqueIds } from 'react-html-id';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import { combineStateChangeCalculators, componentLocalStateUpdater, Transforms } from '../ComposableFormUtils';
import ErrorDisplay from '../ErrorDisplay';
import QueryWithStateDisplay from '../QueryWithStateDisplay';

const previousProposalsQuery = gql`
query {
  myProfile {
    id

    user {
      id

      event_proposals {
        id
        title
        status
        created_at

        convention {
          id
          name
        }
      }
    }
  }
}
`;

const createEventProposal = gql`
mutation($cloneEventProposalId: Int) {
  createEventProposal(input: { clone_event_proposal_id: $cloneEventProposalId }) {
    event_proposal {
      id
    }
  }
}
`;

class ProposeEventButton extends React.Component {
  static propTypes = {
    caption: PropTypes.node.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: 'btn btn-secondary',
  }

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      cloneEventProposalId: null,
    };

    this.stateUpdater = componentLocalStateUpdater(this, combineStateChangeCalculators({
      cloneEventProposalId: Transforms.integer,
    }));

    enableUniqueIds(this);
  }

  showModal = () => { this.setState({ modalVisible: true, cloneEventProposalId: null }); }

  hideModal = () => { this.setState({ modalVisible: false }); }

  createNewProposal = async (mutate, cloneEventProposalId) => {
    this.setState({ mutationInProgress: true });
    try {
      const { data } = await mutate({ variables: { cloneEventProposalId } });
      window.location.href = `/event_proposals/${data.createEventProposal.event_proposal.id}/edit`;
    } catch (error) {
      this.setState({ mutationInProgress: false, error });
    }
  }

  renderProposeButton = (data) => {
    const buttonId = this.nextUniqueId();

    return (
      <Mutation mutation={createEventProposal}>
        {mutate => (
          <React.Fragment>
            <button
              id={buttonId}
              className={this.props.className}
              type="button"
              onClick={(
                data.myProfile.user.event_proposals.length > 0
                  ? this.showModal
                  : () => this.createNewProposal(mutate, null)
              )}
            >
              {this.props.caption}
            </button>

            <Modal visible={this.state.modalVisible} dialogClassName="modal-lg" className="text-body">
              <div className="modal-header">
                New event proposal
              </div>
              <div className="modal-body text-left">
                <p>
                  If you&apos;d like to propose an event you&apos;ve proposed sometime in the
                  past, please select it here.  Otherwise, choose &quot;start from
                  scratch.&quot;
                </p>
                <ChoiceSet
                  name={`cloneEventProposalId-${buttonId}`}
                  choices={[
                    { value: '', label: 'Start from scratch' },
                    ...(data.myProfile.user.event_proposals || [])
                      .filter(eventProposal => eventProposal.status !== 'draft')
                      .sort((a, b) => b.created_at.localeCompare(a.created_at))
                      .map(eventProposal => ({
                        value: eventProposal.id.toString(),
                        label: `${eventProposal.title} (${eventProposal.convention.name})`,
                      })),
                  ]}
                  disabled={this.state.mutationInProgress}
                  value={(this.state.cloneEventProposalId || '').toString()}
                  onChange={this.stateUpdater.cloneEventProposalId}
                />
                <ErrorDisplay graphQLError={this.state.error} />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  type="button"
                  disabled={this.state.mutationInProgress}
                  onClick={this.hideModal}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={this.state.mutationInProgress}
                  onClick={() => {
                    this.createNewProposal(mutate, this.state.cloneEventProposalId);
                  }}
                >
                  Create proposal
                </button>
              </div>
            </Modal>
          </React.Fragment>
        )}
      </Mutation>
    );
  }

  renderLoginButton = () => (
    <a href={`/users/sign_in?user_return_to=${window.location.href}`} className={this.props.className}>
      Log in to propose an event
    </a>
  )

  render = () => (
    <QueryWithStateDisplay query={previousProposalsQuery}>
      {({ data }) => (
        data.myProfile
          ? this.renderProposeButton(data)
          : this.renderLoginButton()
      )}
    </QueryWithStateDisplay>
  )
}

export default ProposeEventButton;
